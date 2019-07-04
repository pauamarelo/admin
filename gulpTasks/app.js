const gulp = require('gulp')
const sass = require('gulp-sass')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')
const babel = require('gulp-babel')

gulp.task('app', ['app.html', 'app.css', 'app.js', 'app.assets', 'sassdev', 'sassprod'])

gulp.task('app.html', () => {
    return gulp.src('app/**/*.html')
    .pipe(gulp.dest('public'))
})

gulp.task('app.css', () => {
    return gulp.src('app/**/*.css')
    .pipe(uglifycss({ "uglyComments": true }))
    .pipe(concat('app.min.css'))
    .pipe(gulp.dest('public/css'))
})

gulp.task('app.js', () => {
    return gulp.src('app/**/*.js')
    .pipe(babel({ presets: ['env'] }))
    .pipe(uglify({mangle: false}))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('public/js'))
})

gulp.task('app.assets', () => {
    return gulp.src('app/**/*.*')
    .pipe(gulp.dest('public'))
})


// Sass
let sassDevOptions = {
    outputStyle: 'expanded'
}
let sassProdOptions = {
    outputStyle: 'compressed'
}

gulp.task('sassdev', function() {
    return gulp.src('app/sass/*.scss')
    .pipe(sass(sassDevOptions).on('error', sass.logError))
    .pipe(gulp.dest('public/css'))
})

gulp.task('sassprod', function() {
    return gulp.src('app/sass/*.scss')
    .pipe(sass(sassProdOptions).on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('public/css'))
})