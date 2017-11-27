'use strict';

var _ = require('lodash');
var del = require('del');
var livereload = require('gulp-livereload');
var path = require('path');
var plugins = require('gulp-load-plugins')();

var lfrThemeConfig = require('../lib/liferay_theme_config.js');

var divert = require('../lib/divert');
var { 
	taskOsgiClean,
	taskWatch,
	webBundleDir
} = divert('watch');

var gutil = plugins.util;

var themeConfig = lfrThemeConfig.getConfig();

module.exports = function(options) {
	var gulp = options.gulp;
	var store = gulp.storage;
	var pathBuild = options.pathBuild;
	
	var runSequence = require('run-sequence').use(gulp);

	gulp.task('watch', () => taskWatch(options));
	
	gulp.task('watch:clean', function(cb) {
		del([webBundleDir], cb);
	});

	gulp.task('watch:osgi:clean', (done) => taskOsgiClean(options, done));

	gulp.task('watch:setup', function() {
		return gulp.src(path.join(pathBuild, '**/*'))
			.pipe(gulp.dest(webBundleDir));
	});

	gulp.task('watch:teardown', function(cb) {
		store.set('webBundleDir');

		runSequence('watch:clean', cb);
	});
};
