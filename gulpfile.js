// Load plugins
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var babel = require('gulp-babel');
var jshint = require('gulp-jshint');
var imagemin = require('imagemin');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cache = require('gulp-cache');
var livereload = require('gulp-livereload');
var del = require('del');
var connect = require('gulp-connect');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var filter = require('gulp-filter');
var uglify = require('gulp-uglify');

// Don't break watch on error
var onError = function (err) {
    console.log(err);
    this.emit('end');
};

// Put up a local server
gulp.task('connect', function() {
    connect.server({
        root: 'build',
        port: 1234,
        livereload: true
    });
});

// Html Templates 
gulp.task('templates', function() {
    return gulp.src('src/**/*.html')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // only pass unchanged *main* files and *all* the partials
    .pipe(changed('build', {extension: '.html'}))

    // filter out partials (folders and files starting with "_" )
    // .pipe(filter(function (file) {
    //   return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    // }))

    // Distribute to build path
    .pipe(gulp.dest('build/'))

    // Reload page with LiveReload
    .pipe(connect.reload());
});

// Styles
gulp.task('styles', function() {
    return gulp.src('src/assets/styles/style.scss')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Specify output
    .pipe(sass().on('error', sass.logError))

    // Autoprefixer
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))

    // Add a .min version
    .pipe(rename({ suffix: '.min' }))

    // Minify .min version
    // .pipe(minifycss())

    // Distribute to build path
    .pipe(gulp.dest('build/styles'))

    // Show notification
    .pipe(notify({ message: 'Styles task complete' }))

    // Livereload
    .pipe(connect.reload());
});

// Concat js es6 with Babel
gulp.task('scripts', function() {
    return gulp.src('src/assets/scripts/*.js')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Compile ES6 with Babel
    .pipe(babel())

    // Concatinate in one file
    .pipe(concat('main.js'))

    // Add a .min version
    .pipe(rename({ suffix: '.min' }))

    // Minify with jsUglify
    // .pipe(uglify())

    // Distribute to build
    .pipe(gulp.dest('build/scripts'))

    // Show notifcation
    .pipe(notify({ message: 'Scripts task complete' }))

    // Livereload
    .pipe(connect.reload());
});

gulp.task('libs', function() {
    return gulp.src('src/assets/scripts/libs/*.js')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Concatinate in one file
    .pipe(concat('libs.js'))

    // Add a .min version
    .pipe(rename({ suffix: '.min' }))

    // Minify with jsUglify
    .pipe(uglify())

    // Distribute to build
    .pipe(gulp.dest('build/scripts/libs'))

    // Show notifcation
    .pipe(notify({ message: 'Libs task complete' }))

    // Livereload
    .pipe(connect.reload());
});

// Lint scripts
gulp.task('lint', function() {
    return gulp.src('src/assets/scripts/*.js')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Lint all the scripts
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compress Images
gulp.task('images', function() {
    return gulp.src('src/assets/images/*')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Image optimization
    // .pipe(cache(imagemin({ 
    //     optimizationLevel: 3, 
    //     progressive: true, 
    //     interlaced: true 
    // })))

    // Distribute to build
    .pipe(gulp.dest('build/images'))

    // Show notifcation
    .pipe(notify({ message: 'Images task complete' }))

    // Livereload
    .pipe(connect.reload());
});

gulp.task('videos', function() {
    return gulp.src('src/assets/videos/**/*')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Distribute to build
    .pipe(gulp.dest('build/videos'))

    // Show notifcation
    .pipe(notify({ message: 'Videos task complete' }))

    // Livereload
    .pipe(connect.reload());
});

gulp.task('fonts', function() {
    return gulp.src('src/assets/fonts/**/*')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Distribute to build
    .pipe(gulp.dest('build/fonts'))

    // Show notifcation
    .pipe(notify({ message: 'Fonts task complete' }))

    // Livereload
    .pipe(connect.reload());
});

gulp.task('icons', function() {
    return gulp.src('src/assets/icons/*')

    // Catch errors
    .pipe(plumber({errorHandler: onError}))

    // Distribute to build
    .pipe(gulp.dest('build/icons'))

    // Show notifcation
    .pipe(notify({ message: 'Icons task complete' }))

    // Livereload
    .pipe(connect.reload());
});

// Clean
gulp.task('clean', function(cb) {
  del('build', cb);
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('templates', 'styles', 'scripts', 'lint', 'images', 'videos', 'fonts', 'icons', 'libs');
});

// Set global watch var to true
gulp.task('setWatch', function() {
  global.isWatching = true;
});

// Watch
gulp.task('watch', ['setWatch', 'templates', 'styles', 'scripts', 'images', 'videos', 'fonts', 'icons', 'libs', 'connect'], function() {

  // Watch .scss files
  gulp.watch('src/assets/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/assets/scripts/*.js', ['scripts']);

  // Watch .html files
  gulp.watch('src/**/*.html', ['templates']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch videos files
  gulp.watch('src/videos/**/*', ['videos']);

  // Watch fonts files
  gulp.watch('src/fonts/**/*', ['fonts']);

  // Watch icons files
  gulp.watch('src/icons/*', ['icons']);

  // Watch libs files
  gulp.watch('src/assets/scripts/libs/*.js', ['libs']);

  // Watch any files in build/, reload on change
  gulp.watch(['build/**/*']).on('change', livereload.changed);

});