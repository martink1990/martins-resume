const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');
const csso = require('gulp-csso');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');

gulp.task('sass', function () {
    return gulp.src('./dev/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dev/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('watch', function () {
    gulp.watch('./dev/scss/**/*.scss', gulp.series('sass'));
    gulp.watch('./dev/**/*.{html,js}', gulp.series('reload'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: './dev'
    });
});

gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('minifyhtml', () => {
    return gulp.src('./dev/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./dist'));
});

gulp.task('minifycss', function () {
    return gulp.src('./dev/css/**/*.css')
        .pipe(csso())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('minifyjs', function () {
    return pipeline(
        gulp.src('./dev/js/**/*.js'),
        uglify(),
        gulp.dest('./dist/js')
    );
});

gulp.task('fonts', function () {
    return gulp.src('./dev/fonts/**/*')
        .pipe(gulp.dest('./dist/fonts'))
});

gulp.task('images', function () {
    return gulp.src('./dev/images/**/*.+(png|jpg|jpeg|gif|svg|ico)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('./dist/images'))
});

gulp.task('default', gulp.parallel('serve', 'watch'));
gulp.task('build', gulp.series('minifyhtml' ,'minifycss', 'minifyjs', 'fonts', 'images'));