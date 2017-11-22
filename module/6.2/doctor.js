'use strict';

var { logMissingDeps } = require('../lib/doctor.js');

function checkMissingDeps(dependencies, rubySass) {
	var missingDeps = 0;

	missingDeps = logMissingDeps(
		dependencies,
		'liferay-theme-deps-6.2',
		missingDeps,
	);

	if (!rubySass) {
		missingDeps = logMissingDeps(dependencies, 'gulp-sass', missingDeps);
	}

	return missingDeps;
}

module.exports = { checkMissingDeps };
