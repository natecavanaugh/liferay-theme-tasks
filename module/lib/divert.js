function divert(liferayVersion, moduleName) {
	return require(`../${liferayVersion}/${moduleName}`);
}

module.exports = divert;
