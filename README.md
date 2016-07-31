# blrplt

My ES6 / node.js boilerplate.

## Available branches

### `master` branch

 - [cycle.js](http://cycle.js.org) + [xstream](https://github.com/staltz/xstream) + [Immutable.js](https://facebook.github.io/immutable-js/)
 - [Babel](http://babeljs.io)
 - [browserify](http://browserify.org)
 - [Gulp](http://gulpjs.com)
 - [Sass](http://sass-lang.com)
 - [autoprefixer](https://github.com/postcss/autoprefixer)
 - [Uglify JS](https://github.com/mishoo/UglifyJS2) (commented out by default)
 - custom web server

#### Usage

 1. Download and unzip desired branch (see below)
 2. `npm update`
 3. `gulp`
 4. Navigate to [http://localhost:3001](http://localhost:3001)


### `pg` branch

 - all the things from `master` branch
 - [docker](https://www.docker.com) / [PostgreSQL](https://www.postgresql.org) container
 - [node-postgres](https://github.com/brianc/node-postgres)
 - custom code to apply DB changes

#### Usage

1. Execute `docker-compose` from within `docker` folder:

        cd docker
        docker-compose up

    This should build images and start containers:
     - `blrplt-app` with application code and dev tools
     - `blrplt-pg` with PostgreSQL database

1. Install all npm modules:

       docker exec -it blrplt-app bash
       npm install
1. Run gulp

       docker exec -it blrplt-app bash
       gulp
1. Navigate to [http://localhost:3001](http://localhost:3001)

#### Applying changes to database

When app is stared, following steps are executed:

1. Scan `sql` folder for `*.sql` files matching `/^[0-9]{12}(-[^\.]+)?\.sql$/` pattern
2. For each file check if timestamp (first part of filename) is present in `delta_sql` table
3. Execute file's content using `psql` if not already present in `delta_sql` table
4. Update `delta_sql` table with executed file's timestamp

This ensures consistent development of database schema. Update can also be forced by executing `dst/server/lib/sql.js` directly.

