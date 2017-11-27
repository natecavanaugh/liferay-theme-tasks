var path = require('path');

var themeUtil = require('../../util');

function taskCssFiles(pathBuild, store) {
	var srcPath = path.join(pathBuild, 'css/*.css');

	var filePath = store.get('changedFile').path;

	if (!themeUtil.isSassPartial(filePath)) {
		var fileName = path.basename(filePath);

		srcPath = path.join(pathBuild, 'css', fileName);
	}

	return fastDeploy(srcPath, pathBuild);
}

module.exports = { taskCssFiles };