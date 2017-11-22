var lfrThemeConfig = require('../../lib/liferay_theme_config');

function divert(moduleName, version = null) {
	if (!version) {
		var config = lfrThemeConfig.getConfig();

		version = config ? config.version : '7.0';
	}

	return require(`../${version}/${moduleName}`);
}

module.exports = divert;
