var _ = require('lodash');

var lfrThemeConfig = require('../../lib/liferay_theme_config');

function divert(moduleName, version = null) {
	if (!version) {
		var config = lfrThemeConfig.getConfig();

		version = config ? config.version : '7.0';
	}

	var module = {};

	module = Object.assign(module, safeRequire(`./common/${moduleName}`));
	module = Object.assign(module, safeRequire(`./${version}/${moduleName}`));

	return module;
}

function safeRequire(moduleName) {
	var module = {};

	try {
		module = require(moduleName);
	} catch (err) {
		if(err.message !== `Cannot find module '${moduleName}'`) {
			throw err;
		}
	}

	if (!_.isPlainObject(module)) {
		throw new Error(
			'Only modules exporting plain objects can be used with divert'
		);
	}

	return module;
}

module.exports = divert;
