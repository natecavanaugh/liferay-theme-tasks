var _ = require('lodash');
var path = require('path');

function getCssSrcPath(srcPath, config) {
	return srcPath;
}

var depModuleName = 'liferay-theme-deps-7.0';

function isSassPartial(name) {
    return _.startsWith(path.basename(name), '_');
}

module.exports = { getCssSrcPath, depModuleName, isSassPartial };