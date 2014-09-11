(function() {
  'use strict';

   var gulp    = require('gulp'),
       util    = require('gulp-util'),
       react   = require('gulp-react'),
       concat  = require('gulp-concat'),
       plumber = require('gulp-plumber'),
       nodemon = require('gulp-nodemon'),
       prefix  = require('gulp-autoprefixer'),
       sass    = require('gulp-ruby-sass');

  var onError = function(err) {
    util.beep();
    console.log(err);
  };

  gulp.task('react', function() {
    gulp.src('src/jsx/**/*.jsx')
      .pipe(plumber({errorHandler:onError}))
      .pipe(react({harmony:true, noCacheDir:false}))
      .pipe(concat('components.js'))
      .pipe(gulp.dest('public/js'));
  });

  gulp.task('sass', function() {
    gulp.src('src/scss/*.scss')
      .pipe(plumber({errorHandler:onError}))
      .pipe(sass({sourcemap:false, style:'compressed'}))
      .pipe(prefix(['last 1 version', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
      .pipe(gulp.dest('public/css'));
  });

  gulp.task('server', function() {
    nodemon({
      script: 'app.js',
      watch: 'app.js',
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'tunnel' }
    })
    .on('change', []);
  });

  gulp.task('server-production', function() {
    nodemon({
      script: 'app.js',
      watch: 'app.js',
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'production' }
    })
    .on('change', []);
  });

  gulp.task('server-development', function() {
    nodemon({
      script: 'app.js',
      watch: 'app.js',
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'development' }
    })
    .on('change', []);
  });

  gulp.task('server-local', function() {
    nodemon({
      script: 'app.js',
      watch: 'app.js',
      nodeArgs: ['--harmony'],
      env: { NODE_ENV: 'local' }
    })
    .on('change', []);
  });

  // gulp.task('tunnel', function() {});

  gulp.task('watch', function() {
    gulp.watch('src/jsx/**/*.jsx', ['react']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
  });

  gulp.task('development', ['react', 'sass', 'server-development', 'watch']);
  gulp.task('production',  ['react', 'sass', 'server-production', 'watch']);
  gulp.task('local',       ['react', 'sass', 'server-local', 'watch']);
  gulp.task('default',     ['react', 'sass', 'server', 'watch']);
}());
