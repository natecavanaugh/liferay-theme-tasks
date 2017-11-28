const deployTask = 'deploy:gogo';

function taskWatch(options, startWatch, startWatchSocket, webBundleDir, connectParams) {
	var gulp = options.gulp;
	var store = gulp.storage;
	var runSequence = require('run-sequence').use(gulp);

	options.watching = true;

	store.set('appServerPathPlugin', webBundleDir);

	runSequence('build', 'watch:clean', 'watch:osgi:clean', 'watch:setup', function(err) {
		if (err) {
			throw err;
		}

		var watchSocket = startWatchSocket();

		watchSocket.connect(connectParams)
			.then(function() {
				return watchSocket.deploy();
			})
			.then(function() {
				store.set('webBundleDir', 'watching');

				startWatch();
			});
	});
}

module.exports = {
	deployTask,
	taskWatch
};