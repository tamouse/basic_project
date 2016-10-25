'use strict';

var gulp = require('gulp');

//var cp = require('child_process');
var concat = require('gulp-concat');
var help = require('gulp-task-listing');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var sourceDirs, destDirs;



gulp.task('help', help);

sourceDirs = { src: './src' };
sourceDirs.javascripts = sourceDirs.src + '/js/**/*js';
sourceDirs.stylesheets = [
    sourceDirs.src + '/sass/**/*.sass',
    sourceDirs.src + '/sass/**/*.scss',
];
sourceDirs.images = sourceDirs.src + '/img';

destDirs = { dest: './dist' };
destDirs.javascripts = destDirs.dest + '/js';
destDirs.stylesheets = destDirs.dest + '/css';
destDirs.images = destDirs.dest + '/img';

gulp.task('check', function () {
    console.log(sourceDirs, destDirs);
})

gulp.task('sass', function () {
    return gulp.src(sourceDirs.stylesheets)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDirs.stylesheets));
});

gulp.task('sass:watch', function () {
    gulp.watch(
        sourceDirs.stylesheets,
        ['sass']);
});

gulp.task('compress', function () {
    return gulp.src('./src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(gulp.dest(destDirs.javascripts)) // save .js
        .pipe(uglify({ mangle: false, preserveComments: 'license' }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(destDirs.javascripts)) // save .min.js
});

gulp.task('compress:watch', function () {
    gulp.watch(
        sourceDirs.javascripts,
        ['compress']
    )
})