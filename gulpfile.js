// Load plugins
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const del = require('del');

gulp.task('devStyles', function () {
    return gulp.src([
        './dev/scss/*.scss'
    ])
        .pipe(changed('./dist/css'))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write("maps"))
        .pipe(gulp.dest('./dist/css'))
});
gulp.task('devScripts', function () {
    gulp.src([
        './dev/js/*.js'
    ])
        .pipe(changed('dist/js'))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('./dist/js'))
});

gulp.task('watch', function () {
    gulp.watch(['./dev/scss/*'], ['devStyles']);
    gulp.watch(['./dev/js/*'], ['devScripts']);
});

// 清理开发环境文件
gulp.task('clean', function () {
    return del([
        'dist/js',
        'dist/css'
    ]);
});
