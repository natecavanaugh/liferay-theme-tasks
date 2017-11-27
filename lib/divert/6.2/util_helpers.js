var path = require('path');

var { isSassPartial } = require('../common/util_helpers');

function getCssSrcPath(srcPath, config) {
    var changedFile = config.changedFile;

    var changed = changedFile && changedFile.type === 'changed';

    var argv = require('minimist')(process.argv.slice(2));
    var fullDeploy = (argv.full || argv.f);

    var fastDeploy = !fullDeploy && config.deployed;

    if (changed && fastDeploy) {
        var filePath = changedFile.path;

        var fileDirname = path.dirname(filePath);
        var fileName = path.basename(filePath, '.css');

        if (
            path.basename(fileDirname) !== 'css' || isSassPartial(fileName)
        ) {
            return srcPath;
        }

        srcPath = path.join(srcPath, '..', fileName + '.scss');
    }

    return srcPath;
}

var depModuleName = 'liferay-theme-deps-6.2';

module.exports = { getCssSrcPath, depModuleName };