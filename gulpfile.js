var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    ngAnnotate = require('gulp-ng-annotate'),
    ngTemplates = require('gulp-ng-templates'),
    concat = require('gulp-concat'),
    karma = require('karma').server,
    htmlmin = require('gulp-htmlmin'),
    server = require('gulp-server-livereload'),
    paths = {
      ts: 'src/**/*.ts',
      partials: 'src/partials/**/*.html'
    };

// Test tasks

gulp.task('test', ['dist-full'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('tdd', ['dist-full'], function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// dist tasks

gulp.task('clean-dist-js', function(done) {
  del([
    '.tmp/angular.chord-area.js'
  ], done)
});

gulp.task('clean-dist-tpls', function(done) {
  del([
    '.tmp/angular.chord-area.tpls.js'
  ], done)
});

gulp.task('clean', ['clean-dist-js', 'clean-dist-tpls']);

gulp.task('ngTemplates',['clean-dist-tpls'], function() {
  return gulp.src(paths.partials)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(ngTemplates({
      filename: 'angular.chord-area.tpls.js',
      module: 'hg.chordArea.tpls',
      path: function(path, base) {
        return path.replace(base, '').replace('/src/partials', '/partials');
      }
    }))
    .pipe(gulp.dest('.tmp'));
});

gulp.task('ts' , function() {
  // Convert over to JS from TS
  gulp.src('src/angular.chord-area.ts')
    .pipe(ts())
    .pipe(gulp.dest('src'));
});

gulp.task('dist-js', ['clean-dist-js', 'ts'], function() {
  gulp.src('src/angular.chord-area.js')
    .pipe(gulp.dest('.tmp'));
});

gulp.task('dist-full', ['dist-js', 'ngTemplates'], function() {
  gulp.src(['.tmp/angular.chord-area.tpls.js', '.tmp/angular.chord-area.js'])
    .pipe(concat('angular.chord-area.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('dist-min', ['dist-full'], function() {
  gulp.src('dist/angular.chord-area.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('dist'));
});

// demo tasks
gulp.task('webserver',['dist-full'], function() {
  gulp.src('')
    .pipe(server({
      open: true,
      clientConsole: false
    }));
});

gulp.task('watch', function() {
  gulp.watch(paths.ts, ['dist-full']);
  gulp.watch(paths.partials, ['dist-full']);
});

gulp.task('default', ['watch', 'webserver']);

