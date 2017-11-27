function getCssSrcPath(srcPath, config) {
	var changedFile = config.changedFile;

	var changed = changedFile && changedFile.type === 'changed';

	var fastDeploy = !fullDeploy && config.deployed;

	if (changed && fastDeploy) {
		var filePath = changedFile.path;

		var fileDirname = path.dirname(filePath);
		var fileName = path.basename(filePath, '.css');

		if (
			path.basename(fileDirname) !== 'css' ||
			this.isSassPartial(fileName)
		) {
			return srcPath;
		}

		srcPath = path.join(srcPath, '..', fileName + '.scss');
	}

	return srcPath;
}

const getDepModuleName = () => 'liferay-theme-deps-6.2';

module.exports = { getCssSrcPath, getDepModuleName };
