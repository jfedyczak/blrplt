import Rx from 'rx'
import http from 'http'
import fs from 'fs'

let publicFiles = []

const srv = http.createServer()
let request$ = Rx.Observable
	.fromEvent(srv, 'request', (req, res) => { 
		return {req, res, url: req.url, method: req.method} 
	})
	.map(f => {
		f.url = f.url === '/' ? '/index.html' : f.url
		return f
	})
	.subscribe(r => {
		if (publicFiles.indexOf(r.url) >= 0) {
			r.res.writeHead(200, {
				'Content-Type': 'text'
			})
			fs.createReadStream(`${__dirname}/../../public${r.url}`)
				.pipe(r.res)
		} else {
			r.res.writeHead(404)
			r.res.end()
			console.log(`not found ${r.url}`);
		}
	})

const filesInDir = Rx.Observable.fromNodeCallback(fs.readdir)
const statFile = Rx.Observable.fromNodeCallback(fs.stat)

const listFiles = (prefix, dir = '') => {
	const file$ = filesInDir(`${prefix}/${dir}`)
		.flatMap(file => file)
		.filter(file => !file.startsWith('.'))
	const isDir$ = file$
		.map(file => statFile(`${prefix}/${dir}/${file}`))
		.flatMap(file => file)
		.map(file => file.isDirectory())
	return file$
		.zip(isDir$, (file, isDir) => {return {file, isDir}})
		.map(f => {
			if (f.isDir) {
				return listFiles(prefix, `${dir}/${f.file}`)
			}
			return Rx.Observable.return(`${dir}/${f.file}`)
		})
		.flatMap(file => file)
}

listFiles('public')
	.toArray()
	.subscribe(list => {
		publicFiles = list
		console.log(publicFiles);
		srv.listen(3001)
	})

