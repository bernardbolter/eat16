"use strict";

var gulp = require('gulp'),
		gutil = require('gulp-util'),
		sass = require('gulp-sass'),
		autoprefixer = require('gulp-autoprefixer'),
		sourcemaps = require('gulp-sourcemaps'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		fileInclude = require('gulp-file-include'),
		minifyHTML = require('gulp-minify-html'),
		svgstore = require('gulp-svgstore'),
		svgmin = require('gulp-svgmin'),
		imagemin = require('gulp-imagemin'),
		rename = require('gulp-rename'),
		clean = require('gulp-clean'),
		watch = require('gulp-watch'),
		connect = require('gulp-connect'),
		livereload = require('gulp-livereload');

var path = {
	  JADE: './assets/templates/index.jade',
	  HTML: './assets/templates/*.html',
	  SASS: [
		'./assets/sass/style.sass',
		'./assets/sass/**/*.scss',
		'./assets/sass/**/*.sass'
			],
	  JS: [
	  	'./assets/js/vendor/*.js',
	  	'./assets/js/*.js'
	  	],
	  SVG: './assets/svg/*.svg',
	  IMG: [
	  	'./assets/img/**/*.jpg',
	  	'./assets/img/**/*.gif',
	  	'./assets/img/**/*.png'
	  	],
	  FONTS: [
	  	'./assets/fonts/*.woff2',
	  	'./assets/fonts/*.woff',
	  	'./assets/fonts/*.ttf'
	  ],
	  DATA: './assets/data/*.json'
};

// STYLE SHEETS - SASS COMMANDS --------------------------------------------------------------------

gulp.task('sass-in', function() {
	gulp.src(path.SASS)
		.pipe(sourcemaps.init())
		.pipe(sass({style: 'expanded', lineNumbers : true }).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./builds/inbound/css'))
		.pipe(connect.reload());
});

gulp.task('sass-out', function() {
	gulp.src(path.SASS)
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer('last 2 versions', 'safari 5', 'ie8', 'ie9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./builds/outbound/css'))
		.pipe(connect.reload());
});

// JAVASCRIPT - JS COMMANDS --------------------------------------------------------------------

gulp.task('js-in', function() {
	gulp.src(path.JS)
		.pipe(sourcemaps.init())
		.pipe(concat('mashup.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./builds/inbound/js'))
		.pipe(connect.reload());
});

gulp.task('js-out', function() {
	gulp.src(path.JS)
		.pipe(concat('mashup.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./builds/outbound/js'))
		.pipe(connect.reload());
});

// HTML - HTML TEMPLATE COMMANDS --------------------------------------------------------------------

gulp.task('html-in', function() {
	  gulp.src(['./assets/templates/index.html'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./builds/inbound'))
    .pipe(connect.reload());
});

gulp.task('html-out', function() {
	  gulp.src(['./assets/templates/index.html'])
    .pipe(fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(minifyHTML({ empty: true }))
    .pipe(gulp.dest('./builds/outbound'))
});

// SVGS - BUILD svg.def FILE FOR INLINE USE --------------------------------------------------------

gulp.task('svg-in', function() {
    gulp.src(path.SVG)
    	.pipe(rename({prefix: 'svg-'}))
    	.pipe(svgmin())
    	.pipe(svgstore())
    	.pipe(rename('defs.svg'))
    	.pipe(gulp.dest('./builds/inbound/svgs'))
    	.pipe(connect.reload());
});

gulp.task('svg-out', function() {
    gulp.src(path.SVG)
    	.pipe(rename({prefix: 'svg-'}))
    	.pipe(svgmin())
    	.pipe(svgstore())
    	.pipe(rename('defs.svg'))
    	.pipe(gulp.dest('./builds/outbound/svgs'))
    	.pipe(connect.reload());
});

// IMAGES -- MOVE AND MINIFY IMAGES FOR PRODUCTION -----------------------------------------

gulp.task('img-in', function() {
	gulp.src( path.IMG )
	.pipe(gulp.dest('./builds/inbound/img'))
});

gulp.task('img-out', function() {
	gulp.src( path.IMG )
	.pipe(imagemin())
	.pipe(gulp.dest('./builds/outbound/img'))
});

// DATA ---- MOVE AND MINIFY JSON FOR PRODUCTION ------------------------------------------------

gulp.task('data-in', function() {
	gulp.src( path.DATA )
	.pipe(gulp.dest('./builds/inbound/data'))
});

gulp.task('data-out', function() {
	gulp.src( path.DATA )
	.pipe(gulp.dest('./builds/outbound/data'))
});

// FOTNS --- MOVE AND MINIFY FONTS FOR PRODUCTION ------------------------------------------------

gulp.task('fonts-in', function() {
	gulp.src( path.FONTS )
	.pipe(gulp.dest('./builds/inbound/fonts'))
});

gulp.task('fonts-out', function() {
	gulp.src( path.FONTS )
	.pipe(gulp.dest('./builds/outbound/fonts'))
});

// SERVER COMMANDS COMMANDS --------------------------------------------------------------------

gulp.task('connect', function() {
	connect.server({
    root: './builds/inbound',
    livereload: true,
    port: 8001
  });
});

gulp.task('connect-out', function() {
	connect.server({
    root: './builds/outbound',
    port: 8002
  });
});

// CLEAN BUILD FOLDERS --------------------------------------------------------------------

gulp.task('clean-in', function() {
	return gulp.src('./builds/inbound', {read: false})
	.pipe(clean());
});

gulp.task('clean-out', function() {
	return gulp.src('./builds/outbound', {read: false})
	.pipe(clean());
});

gulp.task('watch', function() {
	gulp.watch(path.SASS, ['sass-in']);
	gulp.watch(path.JS, ['js-in']);
	gulp.watch(path.HTML, ['html-in']);
	gulp.watch(path.SVG), ['svg-in'];
	gulp.watch(path.IMG), ['img-in'];
});

gulp.task('default', ['sass-in', 'js-in', 'html-in', 'svg-in', 'img-in', 'fonts-in', 'data-in', 'connect', 'watch']);

gulp.task('out', ['sass-out', 'js-out', 'html-out', 'svg-out', 'img-out', 'fonts-out', 'data-out', 'connect-out']);