var inquirer = require('inquirer');

var { choices } = require('../common/kickstart_choices');

choices = choices.concat([
	new inquirer.Separator(),
	{
		name: 'Classic',
		value: 'classic',
	},
]);

module.exports = { choices };
