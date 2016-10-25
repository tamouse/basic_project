'use strict';

var gulp = require('gulp');


var browserSync = require('browser-sync');
var gulpUtil = require('gulp-util');
var gulpEjs = require('gulp-ejs');
var help = require('gulp-task-listing');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var webpack = require('webpack');
var gulpWebpack = require('webpack-stream');

var sourceDirs, destDirs;


sourceDirs = { src: './src' };
sourceDirs.htmlFiles = sourceDirs.src + '/html/**/*.html';
sourceDirs.templates = sourceDirs.src + '/templates/*.ejs';
sourceDirs.javascripts = sourceDirs.src + '/js/**/*.js';
sourceDirs.webpack_entry = sourceDirs.src + '/js/index.js';
sourceDirs.stylesheets = [
    sourceDirs.src + '/sass/**/*.sass',
    sourceDirs.src + '/sass/**/*.scss',
    './node_modules/font-awesome/scss/font-awesome.scss'
];
sourceDirs.images = sourceDirs.src + '/img';
sourceDirs.fonts = [
    './node_modules/font-awesome/fonts/*'
];
sourceDirs.templates = sourceDirs.src + '/**/*.jade';

destDirs = { dest: './dist' };
destDirs.javascripts = destDirs.dest + '/js';
destDirs.stylesheets = destDirs.dest + '/css';
destDirs.images = destDirs.dest + '/img';
destDirs.fonts = destDirs.dest + '/fonts';


gulp.task('help', help);


gulp.task('check', function () {
    console.log(sourceDirs, destDirs);
});



gulp.task('sass', function () {
    return gulp.src(sourceDirs.stylesheets)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(destDirs.stylesheets))
        .pipe(browserSync.stream());
});
gulp.task('sass:watch', function () {
    gulp.watch(
        sourceDirs.stylesheets,
        ['sass']
    );
});



gulp.task('webpack', function () {
    return gulp.src(sourceDirs.webpack_entry)
        .pipe(gulpWebpack({
            entry: sourceDirs.webpack_entry,
            output: {
                filename: 'bundle.js'
            },
            devtool: 'source-map',
            plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    mangle: false
                })
            ]

        }))
        .pipe(gulp.dest(destDirs.javascripts))
        .pipe(browserSync.stream());
});
gulp.task('webpack:watch', function () {
    gulp.watch(
        sourceDirs.javascripts,
        ['webpack']
    );
});



gulp.task('fonts', function () {
    return gulp.src(sourceDirs.fonts)
        .pipe(gulp.dest(destDirs.fonts))
        .pipe(browserSync.stream());
});
gulp.task('fonts:watch', function () {
    gulp.watch(sourceDirs.fonts, ['fonts']);
});



gulp.task('images', function () {
    return gulp.src(sourceDirs.images)
        .pipe(gulp.dest(destDirs.images))
        .pipe(browserSync.stream());
});
gulp.task('images:watch', function () {
    gulp.watch(sourceDirs.images, ['images']);
});



gulp.task('templates', function () {
   return gulp.src(sourceDirs.templates)
       .pipe(gulpEjs().on('error', gulpUtil.log))
       .pipe(gulp.dest(destDirs.dest))
       .pipe(browserSync.stream());
});



gulp.task('html', function () {
    return gulp.src(sourceDirs.htmlFiles)
        .pipe(gulp.dest(destDirs.dest))
        .pipe(browserSync.stream());
});
gulp.task('html:watch', function () {
    gulp.watch(sourceDirs.htmlFiles, ['html']);
});


gulp.task('build', ['webpack', 'sass', 'fonts', 'images', 'html']);
gulp.task('build:watch', ['webpack:watch', 'sass:watch', 'fonts:watch', 'images:watch', 'html:watch']);

gulp.task('serve', ['build', 'build:watch'], function () {
    browserSync.init({
        server: destDirs.dest
    });
});


gulp.task('default', ['serve']);
