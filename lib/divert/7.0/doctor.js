'use strict';

var { logMissingDeps } = require('../common/doctor.js');

function checkMissingDeps(dependencies, rubySass) {
	var missingDeps = 0;

	missingDeps = logMissingDeps(
		dependencies,
		'liferay-theme-deps-7.0',
		missingDeps,
	);

	if (rubySass) {
		missingDeps = logMissingDeps(
			dependencies,
			'gulp-ruby-sass',
			missingDeps,
		);
	}

	return missingDeps;
}

module.exports = { checkMissingDeps };
