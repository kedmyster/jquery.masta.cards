(function() {
  'use strict';

  var gulp = require('gulp');
  var gulpif = require('gulp-if');
  var concat = require('gulp-concat');
  var sass = require('gulp-sass');
  var rename = require('gulp-rename');
  var copy = require('gulp-copy');
  var browserSync = require('browser-sync').create();

  // Configuration

  var config = {
    bower: './bower_components',
    src: './src',
    dist: './dist',
    test: './test'
  };

  gulp.task('css', function() {
    return gulp.src([
        config.src + '/scss/jquery.masta.cards.scss'
      ])
      .pipe(gulpif('*.scss', sass()))
      .pipe(concat('jquery.masta.cards.css'))
      .pipe(gulp.dest(config.dist))
      .pipe(gulp.dest(config.test))
      .pipe(browserSync.stream());
  });

  gulp.task('js', function() {
    return gulp.src([
        config.src + '/js/jquery.masta.cards.js'
      ])
      .pipe(concat('jquery.masta.cards.js'))
      .pipe(gulp.dest(config.dist))
      .pipe(gulp.dest(config.test))
      .pipe(browserSync.stream());
  });

  gulp.task('serve', function() {
    browserSync.init({
      server: './test',
			port: 3000
    });

    gulp.watch(config.src + '/scss/*.scss', ['css']);
    gulp.watch(config.src + '/js/*.js', ['js']);
  });

  gulp.task('copy', function() {
    gulp.src([
      config.bower+"/jquery/dist/jquery.js",
      config.bower+"/velocity/velocity.js",
      config.bower+"/velocity/velocity.ui.js"
    ]).pipe(gulp.dest(config.test));
  });

  gulp.task('build', ['css', 'js']);

})();
