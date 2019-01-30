/* eslint-disable node/no-unpublished-require */

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  cleancss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  autoprefixer = require('gulp-autoprefixer'),
  notify = require('gulp-notify'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  nodemon = require('gulp-nodemon');

/* eslint-enable node/no-unpublished-require */

gulp.task('styles', function() {
  return gulp
    .src('dev/sass/**/*.sass')
    .pipe(sass().on('error', notify.onError()))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('js', () => {
  return gulp
    .src([
      'dev/libs/medium-editor/dist/js/medium-editor.min.js',
      'dev/js/auth.js',
      'dev/js/post.js',
      'dev/js/comment.js',
      'dev/js/settings.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/js'))
    .on('error', gutil.log);
});

/* Exec. nodemon with gulp */
gulp.task('nodemon', function() {
  nodemon({ script: 'app.js' });
});

gulp.task('watch', () => {
  gulp.watch('dev/js/**/*.js', gulp.parallel('js'));
  gulp.watch(
    ['dev/sass/**/*.sass', 'dev/libs/**/*.scss', 'dev/libs/**/*.css'],
    gulp.parallel('styles')
  );
});

gulp.task('default', gulp.parallel('watch', 'styles', 'js', 'nodemon'));
