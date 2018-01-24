var gulp = require("gulp");
var browserSync = require('browser-sync').create();

gulp.task('default', ['server', 'watch']);

gulp.task('server', function () {
  return browserSync.init( ['build/assets/js/*.js', 'build/assets/css/main.css', 'build/*.html'],{
    injectChanges: true,
    server: {
      baseDir: './build'
    }
  });
});

gulp.task('watch', function(){
        gulp.watch('./assets/**/*', ['build']);
        gulp.watch('./src/styles/**/*', ['build']);
        gulp.watch('./src/**/*', ['build']);
        gulp.watch('./templates/*', ['build']);
});

gulp.task('build', function(){
        require('./metalSmith')();
});
