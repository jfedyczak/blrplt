'use strict'

var gulp = require("gulp"),
	gutil = require("gulp-util"),
	sass = require("gulp-sass"),
	babel = require("gulp-babel"),
	autoprefixer = require("gulp-autoprefixer"),
	plumber = require('gulp-plumber'),
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
	srvr = spawn('node',['dst/server/app.js']);
	
	srvr.stdout.on('data', function(data) {
		process.stdout.write(data);
	});
	srvr.stderr.on('data', function(data) {
		process.stderr.write(data);
	});
	srvr.on('close', function(code){
		gutil.log(' -- server stopped: ' + code);
		srvr.stdin.end();
		if (shouldServiceRestart) {
			gutil.log(' -- server restart');
			setTimeout(startService, 1000);
		}
	});
	gutil.log(" -- server started");
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

gulp.task('server', function() {
	return gulp.src('src/server/**/*.js')
		.pipe(plumber())
		.pipe(babel().on('error', gutil.log))
		.pipe(gulp.dest('dst/server/'))
})

gulp.task('client', function() {
	return gulp.src('src/client/**/*.js')
		.pipe(plumber())
		.pipe(babel().on('error', gutil.log))
		.pipe(gulp.dest('dst/client/'))
})

gulp.task('sass', function() {
	return gulp.src('src/sass/style.sass')
		.pipe(plumber())
		.pipe(sass().on('error', gutil.log))
		.pipe(autoprefixer({
			browsers: ['> 1%']
		}).on('error', gutil.log))
		.pipe(gulp.dest('public/css/'));
});

gulp.task('browserify', ['client'], function() {
	return browserify('dst/client/app.js')
		.bundle()
		.pipe(plumber())
		.pipe(source('app.js'))
		.pipe(buffer())
		// .pipe(uglify())
		.pipe(gulp.dest('public/js/'));
});

gulp.task('restart', ['server'], function() {
	return restartService();
})

gulp.task('watchServer', function() {
	return gulp.watch('src/server/**/*.js', ['server', 'restart']);
});

gulp.task('watchSass', function() {
	return gulp.watch('src/sass/style.sass', ['sass']);
});

gulp.task('watchClient', function() {
	return gulp.watch('src/client/*.js', ['browserify']);
});

gulp.task('start', ['compileAll'], function(cb) {
	startService(cb);
});

gulp.task('watchAll', ['watchServer', 'watchSass', 'watchClient']);
gulp.task('compileAll', ['server', 'sass', 'browserify']);

gulp.task('default', ['watchAll', 'start']);
