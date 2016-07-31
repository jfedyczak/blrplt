import pg from 'pg'
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import Promise from 'bluebird'

Promise.promisifyAll(fs)
Promise.promisifyAll(child_process)

const DB_CONFIG = {
	user: 'thedb',
	database: 'thedb',
	host: 'pg',
	psql: '/usr/bin/psql',
	password: 'thedb'
}

const SQL_DIR = path.normalize(`${__dirname}/../../../sql`)
// const SQL_DIR = `/home/app/src/sql`

pg.defaults.parseFloat = false

// create new database connection using DB_CONFIG, returns <client> object and
// <done> function which has to be called to free connection
// invoke without parameters to close unused connection so the script can exit
const dbc = (callback) => {
	if (!callback) {
		return pg.end()
	}
	pg.connect(DB_CONFIG, callback)
}

// execute one query
const dbq = (query, params = [], callback = null) => {
	return new Promise((resolve, reject) => {
		dbc((err, db, done) => {
			if (err) reject(err)
			db.query(query, params, (e, r) => {
				done()
				if (e) return reject(e)
				// ensure an array
				if (!r.rowCount) r.rows = []
				resolve(r.rows)
				if (callback) callback(e, r)
			})
		})
	})
}

// exec psql with filename and timestamp
const execPsql = (filename, timestamp) => {
	console.log(` -- executing ${filename}`)
	// read SQL from file
	return fs.readFileAsync(filename, 'utf8').then((sql) => {
		// append psql commands and insert
		sql = `\\set ON_ERROR_STOP\nbegin; insert into delta_sql (delta_sql_id) values ('${timestamp}');\n\n${sql}\n\ncommit;`
		// write to temporary file
		return fs.writeFileAsync(`${SQL_DIR}/_tmp.sql`, sql, 'utf8')
	}).then(() => {
		// put password in env if required
		const env = {}
		if (DB_CONFIG.password) env.PGPASSWORD = DB_CONFIG.password
		// execute psql
		return child_process.execAsync(`${DB_CONFIG.psql} -U ${DB_CONFIG.user} -h ${DB_CONFIG.host} -f ${SQL_DIR}/_tmp.sql ${DB_CONFIG.database}`, {env: env})
	}).then((stdout, stderr) => {
		// remove temp file
		return fs.unlinkAsync(`${SQL_DIR}/_tmp.sql`)
	})
}

// exec psql if filename hasn't been executed before
const psql = (filename) => {
	let timestamp = filename.substring(0,12)
	filename = `${SQL_DIR}/${filename}`
	return dbq("SELECT EXISTS (SELECT 1 FROM delta_sql WHERE delta_sql_id = $1) as present", [timestamp])
	.spread((r) => {
		if (r.present) return true
		return execPsql(filename, timestamp)
	})
}

// exec *.sql files from /sql folder
const runDelta = () => {
	console.log(` -- scanning ${SQL_DIR}/ for SQL files...`)
	return dbq("create table if not exists delta_sql (delta_sql_id text primary key,czas timestamp(0) not null default now())")
	.then(() => {
		return fs.readdirAsync(`${SQL_DIR}/`)
	}).then((files) => {
		files = files.filter((name) => /^[0-9]{12}(-[^\.]+)?\.sql$/.test(name))
		files.sort()
		console.log(` -- found ${files.length} files...`);
		return Promise.mapSeries(files, psql)
	})
}

export { dbc, dbq, runDelta }

// load new SQL content if ran directly
if (!module.parent) {
	runDelta()
	.then(() => {
		dbc()
		console.log(' -- done')
	})
}
