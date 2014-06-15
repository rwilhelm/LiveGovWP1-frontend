var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass'); // "better" than gulp-sass
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber'); // error handling
var autoprefixer = require('gulp-autoprefixer');
var jade = require('gulp-jade');
var react = require('gulp-react');

var onError = function (err) {
  gutil.beep();
  console.log(err);
};

gulp.task('jade', function() {
  return gulp.src('./public/html/src/**/*.jade')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest('./public/html/'));
});

// compile react components
gulp.task('react', function() {
  return gulp.src('./public/js/**/src/*.jsx')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(react({
      harmony: true,
      noCacheDir: true
    }))
    .pipe(gulp.dest('./public/js/'));
});

// recompile sass files (two short beeps: success, anything else: probably failure)
gulp.task('sass', function () {
  gulp.src('public/css/*.scss')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({
      sourcemap: true,
      style: process.env.NODE_ENV === 'development' ? 'expanded' : 'compressed'
    }))
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest('public/css'));
});

// watch stuff for changes
gulp.task('watch', function () {
  gulp.watch(['public/css/**/*.scss'], ['sass']);
  gulp.watch(['public/js/src/**/*.jsx'], ['react']);
  // gulp.watch(['public/html/src/**/*.jade'], ['jade']);
});

// start the server using nodemon (so it restarts if neccessary)
gulp.task('server', function () {
  nodemon({
    script: 'app/server.js',
    verbose: true,
    ext: 'html js',
    nodeArgs: ['--harmony'],
    env: {
      'NODE_ENV': 'development',
      'PORT': process.env.NODE_ENV === 'development' ? 4001 : 3001
    },
    ignore: [
      '*.css',
      '*.log',
      '*.map',
      '*.md',
      '*/.module-cache/',
      '*/.sass-cache/',
      '*/bower_components/',
      '.bowerrc',
      '.DS_Store',
      '.git/',
      '.gitignore',
      '.npmrc',
      'bower.json',
      'Gulpfile.js',
      'LICENSE',
      'Makefile',
      'node_modules/',
      'package.json',
      'public/css/*.css',
      'public/css/*.map',
      'public/html/*.html',
      'test/',
    ]
  })
    .on('change', [])
    .on('restart', []);
});

// development mode: compile sass and react files once, then watch them for
// changes and start the server on port 4001
gulp.task('default', ['sass', 'jade', 'react', 'watch', 'server']);
gulp.task('default', ['sass', 'react', 'watch', 'server']);

// same as above, but don't watch anything
gulp.task('production', ['sass', 'react', 'server']);
