let gulp = require('gulp');
let mocha = require('gulp-mocha');
let gutil = require('gulp-util');

gulp.task('default', function() {
    gulp.watch(['src/**', 'tests/**'], ['mocha']);
});

gulp.task('mocha', function() {
    return gulp.src(['tests/*.js'], { read: false })
        .pipe(mocha({ reporter: 'list' }))
        .on('error', gutil.log);
});
