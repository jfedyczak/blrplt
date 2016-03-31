'use strict'

var gulp = require("gulp"),
	gutil = require("gulp-util"),
	sass = require("gulp-sass"),
	babel = require("gulp-babel"),
	autoprefixer = require("gulp-autoprefixer"),
	browserify = require("browserify"),
	buffer = require("vinyl-buffer"),
	uglify = require("gulp-uglify"),
	source = require("vinyl-source-stream"),
	spawn = require('child_process').spawn

var sameDir = function(file) {
	return file.base
}

var shouldServiceRestart = true;
var srvr = false;
var startService = function() {
	srvr = spawn('node',['dist/app.js']);
	
	srvr.stdout.on('data', function(data) {
		process.stdout.write(data);
	});
	srvr.stderr.on('data', function(data) {
		process.stderr.write(data);
	});
	srvr.on('close', function(code){
		console.log(' -- server stopped: ' + code);
		srvr.stdin.end();
		if (shouldServiceRestart) {
			console.log(' -- server restart');
			setTimeout(startService, 1000);
		}
	});
}

var restartService = function() {
	if (srvr !== false)
		srvr.kill();
}

process.on("SIGINT", function(){
	shouldServiceRestart = false;
	restartService();
	process.exit();
});

gulp.task('jsServer', function() {
	return gulp.src('src-server/**/*.js')
		.pipe(babel().on('error', gutil.log))
		.pipe(gulp.dest('dist/'))
})

gulp.task('sass', function() {
	return gulp.src('styles/*.sass')
		.pipe(sass().on('error', gutil.log))
		.pipe(autoprefixer({
			browsers: ['> 1%']
		}).on('error', gutil.log))
		.pipe(gulp.dest('public/css/'));
});

// gulp.task('browserify', ['coffeeClient'], function() {
// 	return browserify('src-client/index.js')
// 		.bundle()
// 		.pipe(source('bundle.js'))
// 		.pipe(buffer())
// 		// .pipe(uglify())
// 		.pipe(gulp.dest('public/js/'));
// });

gulp.task('restart', ['jsServer'], function() {
	return restartService();
})

gulp.task('watchJsServer', function() {
	return gulp.watch('src-server/**/*.js', ['jsServer', 'restart']);
});

gulp.task('watchSass', function() {
	return gulp.watch('styles/*.sass', ['sass']);
});

gulp.task('start', function() {
	return startService();
});

gulp.task('watchAll', ['watchJsServer', 'watchSass']);
gulp.task('compileAll', ['jsServer', 'sass']);

gulp.task('default', ['compileAll', 'watchAll', 'start']);
