'use strict';

const gulp = require('gulp');
const gulpTasks = require('./gulpFunctions.js');

gulp.task('start', gulpTasks.start);

gulp.task('minify', gulpTasks.minify);

// task that is meant to clean every section of portal or just one
//
// removing all sections - NODE_ENV=master gulp clean
// removing one section - NODE_ENV=master gulp clean --section services
//
// mind that rn and partials are not sections anymore, they are deleted per service
gulp.task('clean', gulpTasks.clean);

// task pushes latest results to remote repo that keeps results.
gulp.task('pushResult', gulpTasks.pushResult);

gulp.task('getDependencyInteractiveDocu', gulpTasks.getDependencyInteractiveDocu);

gulp.task('preparePushResult', gulpTasks.preparePushResult);
