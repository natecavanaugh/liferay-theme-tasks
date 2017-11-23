var path = require('path');

var themeUtil = require('../../util');

function taskCssFiles({pathBuild, gulp}, fastDeploy) {
	var srcPath = path.join(pathBuild, 'css/*.css');

	var { storage } = gulp;

	var filePath = storage.get('changedFile').path;

	return fastDeploy(srcPath, pathBuild);
}

module.exports = { taskCssFiles };