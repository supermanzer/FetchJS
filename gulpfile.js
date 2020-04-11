/*
I like to be able to separate my javascript functions by area of concern into separate JS files.  Since I'm not going full webpack and all, this is my simple Gulp setup
*/


const gulp = require('gulp');
const rename= require ('gulp-rename');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const compileJS = (cb) => {
    return gulp.src("src/*.js")
    .pipe(babel({
        presets: ['@babel/preset-env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
}

const watchJS = (cb) => {
    gulp.watch('src/*.js', gulp.series(compileJS))
}

const defaultTasks = gulp.series(
    compileJS, watchJS
)

exports.default = defaultTasks