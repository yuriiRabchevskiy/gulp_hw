const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

const less = require('gulp-less'),
    minifyCSS = require('gulp-csso');

const concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify');

const notify = require('gulp-notify'),
    livereload = require('gulp-livereload'),
    changed = require('gulp-changed');

const del = require('del');


// copy only mini. fail in ouside build folder
gulp.task('prod', ['clean'], function () {
    gulp.start('copy');
});

// Copy file from a module outside of our project
gulp.task('copy', function () {
    return gulp.src(['./build/progect/js/app.js', './build/progect/css/styles.css', './build/progect/*.html'])
        .pipe(gulp.dest('./prod'));
});

// clean folder prod
gulp.task('clean', function () {
    return del(['prod/']);
});

gulp.task('html', function () {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('build/progect/'))
        .pipe(livereload())
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'HTML task complete' }));
});

gulp.task('css', function () {
    return gulp.src('./src/styles/*.less')
        .pipe(less())
        .pipe(gulp.dest('build/progect/css'))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('src/'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/progect/css'))
        .pipe(livereload())
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Css task complete' }));
});

gulp.task('js', function () {
    gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest('build/progect/js'))
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('build/progect/js'))
        .pipe(livereload())
        .pipe(notify({ message: 'Js task complete' }));
});


gulp.task('watch', function () {

    gulp.watch('src/html/*.html', ['html']);
    gulp.watch('src/styles/*.less', ['css']);
    gulp.watch('src/js/*.js', ['js']);

    livereload.listen();

    gulp.watch(['src/**']).on('change', livereload.changed);
});

gulp.task('serve', ['css'], function () {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    })
    gulp.watch('./src/styles/*.less', ['css'])
    gulp.watch('./src/js/*.js', ['js'])
    gulp.watch('./src/*.html').on('change', browserSync.reload)
});
// default command gulp -> build progect
gulp.task('default', ['serve', 'watch'], () =>
   gulp.src('src/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('all.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('build/myJS'))
);