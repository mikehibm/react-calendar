var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var webserver = require('gulp-webserver');

gulp.task('browserify', function() {
  browserify('./js/app.jsx', { debug: true })
    .transform(babelify)
    .bundle()
    .on("error", function (err) { console.error("Error : " + err.message); })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./build/'))
});

gulp.task('watch', function() {
  gulp.watch('./js/*.jsx', ['browserify'])
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      host: '127.0.0.1',
      livereload: true
    })
  );
});

gulp.task('default', ['browserify', 'watch']);