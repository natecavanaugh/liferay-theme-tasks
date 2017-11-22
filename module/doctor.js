'use strict';

var {
	checkDependencySources,
	getAndUpdateIfNeededRubySass,
	getDependencies,
	logMissingDeps,
} = require('./lib/doctor');
var lfrThemeConfig = require('../lib/liferay_theme_config');

var divert = require('./lib/divert');
var { checkMissingDeps } = divert('doctor');

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
