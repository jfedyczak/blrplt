# blrplt

My ES6 / node.js boilerplate.

## Usage

1. Download and unzip desired branch (see below)
2. `npm update`
3. `gulp`
4. Navigate to [http://localhost:3001](http://localhost:3001)

## Available branches

### master

 - [cycle.js](http://cycle.js.org) + [xstream](https://github.com/staltz/xstream) + [Immutable.js](https://facebook.github.io/immutable-js/)
 - [Babel](http://babeljs.io)
 - [browserify](http://browserify.org)
 - [Gulp](http://gulpjs.com)
 - [Sass](http://sass-lang.com)
 - [autoprefixer](https://github.com/postcss/autoprefixer)
 - [Uglify JS](https://github.com/mishoo/UglifyJS2) (commented out by default)
 - custom web server

### pg

 - all the things from `master` branch
 - [docker](https://www.docker.com) / [PostgreSQL](https://www.postgresql.org) container
 - [node-postgres](https://github.com/brianc/node-postgres)
 - custom code to apply DB changes