// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var clean = require('gulp-clean');
var cssmin = require('gulp-cssmin');
var jade = require('gulp-jade');
var gutil = require('gulp-util');
var notify = require("gulp-notify");

gulp.task('jade', function() {
    var YOUR_LOCALS = {};

    gulp.src('app/views/*.jade')
    .pipe(jade({
      locals: YOUR_LOCALS,
      pretty: true
    }))
    .pipe(gulp.dest('public/'))
    .pipe(connect.reload())
    .pipe(notify("JADE complete ! Watting next action..."));
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass().on('error', function(err){
            gutil.log(err);
            this.emit('end');
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload())
        .pipe(notify("SASS complete ! Watting next action..."));
});

gulp.task('css-min', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass())
        .pipe(cssmin())
        .pipe(gulp.dest('public/css'))
        .pipe(connect.reload());
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/*.*')
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('images', function() {
    return gulp.src('app/images/*.*')
        .pipe(gulp.dest('public/images'));
});

gulp.task('scripts-libs', function() {
    return gulp.src('app/js/libs/*.js')
        .pipe(concat('libs.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'))
        .pipe(connect.reload());
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('app/js/*.js')
        .pipe(gulp.dest('public/js'))
        .pipe(connect.reload())
        .pipe(notify("SCRIPT complete ! Watting next action..."));
});

gulp.task('scripts-mini', function() {
    return gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('public/js'));
});

gulp.task('clean', function () {
    return gulp.src('public/**/**.*', {read: false})
    .pipe(clean());
});


gulp.task('connect', function() {
  connect.server({
    root: 'public',
    livereload: true
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('app/js/**/*.js', ['lint', 'scripts']);
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/images/*.*', ['images']);
    gulp.watch('app/fonts/*.*', ['fonts']);
    gulp.watch('app/**/*.jade', ['jade']);
});

// Default Task
gulp.task('default', ['jade', 'fonts', 'images', 'sass', 'scripts-libs', 'scripts', 'watch', 'connect']);
gulp.task('default-mini', ['jade', 'fonts', 'images', 'css-min', 'scripts-libs', 'scripts-mini', 'connect']);
gulp.task('release', ['clean'], function(){
    gulp.run('default-mini');
    gulp.src('app/views/*.jade')
    .pipe(notify("Final ! Product was completed..."));
});
