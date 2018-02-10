// Load plugins
import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minifycss from 'gulp-minify-css';
import babel from 'gulp-babel';
import jshint from 'gulp-jshint';
import imagemin from 'imagemin';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import notify from 'gulp-notify';
import cache from 'gulp-cache';
import livereload from 'gulp-livereload';
import del from 'del';
import connect from 'gulp-connect';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import filter from 'gulp-filter';
import uglify from 'gulp-uglify';

// Don't break watch on error
var onError = function (err) {
  console.log(err);
  this.emit('end');
};

// Put up a local server
gulp.task('connect', () => {
  connect.server({
    root: 'build',
    port: 1234,
    livereload: true
  });
});

// Html Templates 
gulp.task('templates', () => {
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
gulp.task('styles', () => {
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
  .pipe(minifycss())

  // Distribute to build path
  .pipe(gulp.dest('build/styles'))

  // Show notification
  .pipe(notify({ message: 'Styles task complete' }))

  // Livereload
  .pipe(connect.reload());
});

// Concat js es6 with Babel
gulp.task('scripts', () => {
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
  .pipe(uglify())

  // Distribute to build
  .pipe(gulp.dest('build/scripts'))

  // Show notifcation
  .pipe(notify({ message: 'Scripts task complete' }))

  // Livereload
  .pipe(connect.reload());
});

// Lint scripts
gulp.task('lint', () => {
  return gulp.src('src/assets/scripts/*.js')

  // Catch errors
  .pipe(plumber({errorHandler: onError}))

  // Lint all the scripts
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

// Compress Images
gulp.task('images', () => {
  return gulp.src('src/assets/images/*')
    
  // Catch errors
  .pipe(plumber({errorHandler: onError}))

  // Image optimization
  .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))

  // Distribute to build
  .pipe(gulp.dest('build/images'))

  // Show notifcation
  .pipe(notify({ message: 'Images task complete' }))

  // Livereload
  .pipe(connect.reload());
});

// Clean
gulp.task('clean', (cb) => {
  del('build', cb);
});

// Default task
gulp.task('default', ['clean'], () => {
  gulp.start('templates', 'styles', 'scripts', 'lint', 'images');
});

// Set global watch var to true
gulp.task('setWatch', () => {
  global.isWatching = true;
});

// Watch
gulp.task('watch', ['setWatch', 'templates', 'connect'], () => {

  // Watch .scss files
  gulp.watch('src/assets/styles/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/assets/scripts/**/*.js', ['scripts']);

  // Watch .html files
  gulp.watch('src/**/*.html', ['templates']);

  // Watch image files
  gulp.watch('src/images/**/*', ['images']);

  // Watch any files in build/, reload on change
  gulp.watch(['build/**/*']).on('change', livereload.changed);

});