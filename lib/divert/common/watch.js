var _ = require('lodash');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var gutil = plugins.util;
var WatchSocket = require('../../watch_socket.js');

var staticFileDirs = ['images', 'js'];
var webBundleDirName = '.web_bundle_build';
var webBundleDir = path.join(process.cwd(), webBundleDirName);

function clearChangedFile() {
	store.set('changedFile');
}

function getTaskArray(rootDir, defaultTaskArray) {
	var taskArray = defaultTaskArray || [];

	if (staticFileDirs.indexOf(rootDir) > -1) {
		taskArray = ['deploy:file'];
	} else if (rootDir === 'WEB-INF') {
		taskArray = [
			'build:clean',
			'build:src',
			'build:web-inf',
			'deploy:folder',
		];
	} else if (rootDir === 'templates') {
		taskArray = [
			'build:src',
			'build:themelet-src',
			'build:themelet-js-inject',
			'deploy:folder',
		];
	} else if (rootDir === 'css') {
		taskArray = [
			'build:clean',
			'build:base',
			'build:src',
			'build:themelet-src',
			'build:themelet-css-inject',
			'build:rename-css-dir',
			'build:prep-css',
			'build:compile-css',
			'build:move-compiled-css',
			'build:remove-old-css-dir',
			'deploy:css-files',
		];
	}

	return taskArray;
}

function startWatch(deployTask, pathSrc, fullDeploy) {
	clearChangedFile();

	livereload.listen();

	gulp.watch(path.join(pathSrc, '**/*'), function(vinyl) {
		store.set('changedFile', vinyl);

		var relativeFilePath = path.relative(
			path.join(process.cwd(), pathSrc),
			vinyl.path,
		);

		var filePathArray = relativeFilePath.split(path.sep);

		var rootDir = filePathArray.length ? filePathArray[0] : '';

		var taskArray = [deployTask];

		if (!fullDeploy && store.get('deployed')) {
			taskArray = getTaskArray(rootDir, taskArray);
		}

		taskArray.push(clearChangedFile);

		runSequence.apply(this, taskArray);
	});
}

function startWatchSocket(webBundleDirName) {
	var watchSocket = new WatchSocket({
		webBundleDir: webBundleDirName,
	});

	watchSocket.on('error', function(err) {
		if (err.code === 'ECONNREFUSED' || err.errno === 'ECONNREFUSED') {
			gutil.log(
				gutil.colors.yellow(
					'Cannot connect to gogo shell. Please ensure local Liferay instance is running.',
				),
			);
		}
	});

	return watchSocket;
}

function taskOsgiClean(options, done) {
	var connectParams = _.assign(
		{},
		{
			port: 11311,
		},
		options.gogoShellConfig,
	);
	var distName = options.distName;
	var store = options.gulp.storage;

	var watchSocket = startWatchSocket();

	watchSocket
		.connect(connectParams)
		.then(function() {
			var warPath = path.join(
				store.get('appServerPath'),
				'..',
				'osgi',
				'war',
				distName + '.war',
			);

			return watchSocket.uninstall(warPath, distName);
		})
		.then(done);
}

function taskWatch(options) {
	var gulp = options.gulp;
	var store = gulp.storage;
	var pathSrc = options.pathSrc;
	var argv = options.argv;
	var fullDeploy = (argv.full || argv.f);

	var runSequence = require('run-sequence').use(gulp);

	options.watching = true;

	store.set('appServerPathPlugin', webBundleDir);

	runSequence(
		'build',
		'watch:clean',
		'watch:osgi:clean',
		'watch:setup',
		function(err) {
			if (err) {
				throw err;
			}

			var watchSocket = startWatchSocket();

			watchSocket
				.connect(connectParams)
				.then(function() {
					return watchSocket.deploy();
				})
				.then(function() {
					store.set('webBundleDir', 'watching');

					startWatch('deploy:gogo', pathSrc, fullDeploy);
				});
		},
	);
}

module.exports = {
	startWatch,
	taskOsgiClean,
	taskWatch,
	webBundleDir,
};
