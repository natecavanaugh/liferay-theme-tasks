'use strict';

var lfrThemeConfig = require('../lib/liferay_theme_config');

var divert = require('./divert');
var {
	checkDependencySources,
	checkMissingDeps,
	getAndUpdateIfNeededRubySass,
	getDependencies,
	logMissingDeps,
} = divert('doctor');

module.exports = function(themeConfig, haltOnMissingDeps) {
	themeConfig = themeConfig || lfrThemeConfig.getConfig(true);

	if (!themeConfig) {
		return;
	}

	var dependencies = getDependencies(themeConfig);

	var rubySass = getAndUpdateIfNeededRubySass(themeConfig);

	var missingDeps = checkMissingDeps(dependencies, rubySass);

	checkDependencySources(themeConfig.liferayTheme);

	if (haltOnMissingDeps && missingDeps > 0) {
		throw new Error('Missing ' + missingDeps + ' theme dependencies');
	}
};
