var path = require('path');

var themeUtil = require('../../util');

function taskCssFiles(pathBuild, store) {
	var srcPath = path.join(pathBuild, 'css/*.css');

	var filePath = store.get('changedFile').path;

	return fastDeploy(srcPath, pathBuild);
}

module.exports = { taskCssFiles };