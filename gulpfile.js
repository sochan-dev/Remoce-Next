var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function (done) {
  gulp
    .src('./styles/sass/**/*.scss')
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('./styles/css'));
  done();
});
gulp.task('watch', function () {
  gulp.watch('./styles/sass/**/*.scss', gulp.series(['sass']));
});
