var { startWatch } = require('../common/watch.js');

function taskWatch(options) {
	var pathSrc = options.pathSrc;
	var argv = options.argv;
	var fullDeploy = (argv.full || argv.f);

	options.watching = true;

	startWatch('deploy', pathSrc, fullDeploy);
}

module.exports = { 
	taskWatch 
};