var _ = require('lodash');
var gutil = require('gulp-util');
var chalk = gutil.colors;

function checkDependencySources(liferayTheme) {
	var baseTheme = liferayTheme.baseTheme;
	var themeletDependencies = liferayTheme.themeletDependencies;

	var localDependencies = [];

	if (_.isObject(baseTheme) && baseTheme.path) {
		localDependencies.push(baseTheme);
	}

	if (themeletDependencies) {
		_.forEach(themeletDependencies, function(item) {
			if (item.path) {
				localDependencies.push(item);
			}
		});
	}

	if (localDependencies.length) {
		logLocalDependencies(localDependencies);
	}
}

function getAndUpdateIfNeededRubySass(themeConfig) {
	var rubySass = themeConfig.liferayTheme.rubySass;

	if (
		!_.isUndefined(themeConfig.liferayTheme.supportCompass) &&
		_.isUndefined(rubySass)
	) {
		rubySass = themeConfig.liferayTheme.supportCompass;

		lfrThemeConfig.setConfig({
			rubySass: rubySass,
		});

		lfrThemeConfig.removeConfig(['supportCompass']);
	}

	return rubySass;
}

function getDependencies(themeConfig) {
	var dependencies = themeConfig.dependencies || {};

	if (!_.isEmpty(themeConfig.devDependencies)) {
		dependencies = _.defaults(dependencies, themeConfig.devDependencies);
	}

	return dependencies;
}

function logLocalDependencies(localDependencies) {
	var dependenciesString = _.map(localDependencies, function(item) {
		return item.name;
	}).join(', ');

	gutil.log(
		chalk.yellow('Warning:'),
		'you have dependencies that are installed from local modules. These should only be used for development purposes. Do not publish this npm module with those dependencies!',
	);
	gutil.log(chalk.yellow('Local module dependencies:'), dependenciesString);
}

function logMissingDeps(dependencies, moduleName, missingDeps) {
	if (!dependencies[moduleName]) {
		gutil.log(
			chalk.red('Warning:'),
			'You must install the correct dependencies, please run',
			chalk.cyan('npm i --save-dev', moduleName),
			'from your theme directory.',
		);

		missingDeps++;
	}

	return missingDeps;
}

module.exports = {
	checkDependencySources,
	getAndUpdateIfNeededRubySass,
	getDependencies,
	logMissingDeps,
};
