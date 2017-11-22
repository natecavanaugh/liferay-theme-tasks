var lfrThemeConfig = require('../../lib/liferay_theme_config');

function divert(moduleName, version = null) {
	if (!version) {
		var config = lfrThemeConfig.getConfig();

		version = config ? config.version : '7.0';
	}

	var module = {};

	module = Object.assign(module, require(`./common/${moduleName}`));
	module = Object.assign(module, require(`./${version}/${moduleName}`));

	return module;
}

module.exports = divert;
