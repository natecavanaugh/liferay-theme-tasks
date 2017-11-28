'use strict';

let _ = require('lodash');
let del = require('del');
let livereload = require('gulp-livereload');
let path = require('path');
let plugins = require('gulp-load-plugins')();

let divert = require('../lib/divert');
let lfrThemeConfig = require('../lib/liferay_theme_config.js');
let WatchSocket = require('../lib/watch_socket.js');

let gutil = plugins.util;

let themeConfig = lfrThemeConfig.getConfig();

let CONNECT_PARAMS = {
	port: 11311,
};

module.exports = function(options) {
	let gulp = options.gulp;

	let store = gulp.storage;

	let pathBuild = options.pathBuild;
	let pathSrc = options.pathSrc;

	let argv = options.argv;

	let fullDeploy = argv.full || argv.f;

	let runSequence = require('run-sequence').use(gulp);

	let staticFileDirs = ['images', 'js'];

	let webBundleDirName = '.web_bundle_build';

	let webBundleDir = path.join(process.cwd(), webBundleDirName);

	let connectParams = _.assign({}, CONNECT_PARAMS, options.gogoShellConfig);

	gulp.task('watch', function() {
		divert('watch').taskWatch(
			options,
			startWatch,
			startWatchSocket,
			webBundleDir,
			connectParams
		);
	});

	gulp.task('watch:clean', function(cb) {
		del([webBundleDir], cb);
	});

	gulp.task('watch:osgi:clean', function(cb) {
		let watchSocket = startWatchSocket();

		watchSocket
			.connect(connectParams)
			.then(function() {
				let distName = options.distName;

				let warPath = path.join(
					store.get('appServerPath'),
					'..',
					'osgi',
					'war',
					distName + '.war'
				);

				return watchSocket.uninstall(warPath, distName);
			})
			.then(cb);
	});

	gulp.task('watch:setup', function() {
		return gulp
			.src(path.join(pathBuild, '**/*'))
			.pipe(gulp.dest(webBundleDir));
	});

	gulp.task('watch:teardown', function(cb) {
		store.set('webBundleDir');

		runSequence('watch:clean', cb);
	});

	function clearChangedFile() {
		store.set('changedFile');
	}

	function getTaskArray(rootDir, defaultTaskArray) {
		let taskArray = defaultTaskArray || [];

		if (staticFileDirs.indexOf(rootDir) > -1) {
			taskArray = ['deploy:file'];
		}
		else if (rootDir === 'WEB-INF') {
			taskArray = [
				'build:clean',
				'build:src',
				'build:web-inf',
				'deploy:folder',
			];
		}
		else if (rootDir === 'templates') {
			taskArray = [
				'build:src',
				'build:themelet-src',
				'build:themelet-js-inject',
				'deploy:folder',
			];
		}
		else if (rootDir === 'css') {
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

	function startWatch() {
		clearChangedFile();

		livereload.listen();

		gulp.watch(path.join(pathSrc, '**/*'), function(vinyl) {
			store.set('changedFile', vinyl);

			let relativeFilePath = path.relative(
				path.join(process.cwd(), pathSrc),
				vinyl.path
			);

			let filePathArray = relativeFilePath.split(path.sep);

			let rootDir = filePathArray.length ? filePathArray[0] : '';

			let taskArray = [divert('watch').deployTask];

			if (!fullDeploy && store.get('deployed')) {
				taskArray = getTaskArray(rootDir, taskArray);
			}

			taskArray.push(clearChangedFile);

			runSequence.apply(this, taskArray);
		});
	}

	function startWatchSocket() {
		let watchSocket = new WatchSocket({
			webBundleDir: webBundleDirName,
		});

		watchSocket.on('error', function(err) {
			if (err.code === 'ECONNREFUSED' || err.errno === 'ECONNREFUSED') {
				gutil.log(
					gutil.colors.yellow(
						'Cannot connect to gogo shell. Please ensure local Liferay instance is running.'
					)
				);
			}
		});

		return watchSocket;
	}
};
