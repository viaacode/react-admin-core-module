// eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
const pathAliases = require('./scripts/path-aliases');

const modulesPathGroupPattern = `@{${pathAliases.join(',')}}/**`;

module.exports = {
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:prettier/recommended',
	],
	rules: {
		'@typescript-eslint/naming-convention': [
			'error',
			{
				selector: 'interface',
				format: ['PascalCase'],
				custom: {
					regex: '^I[A-Z]',
					match: false,
				},
			},
		],

		'import/first': 'error',
		'import/no-duplicates': 'error',
		'import/order': [
			'warn',
			{
				alphabetize: {
					order: 'asc',
				},
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: modulesPathGroupPattern,
						group: 'parent',
						position: 'before',
					},
				],
			},
		],

		'sort-imports': [
			'warn',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
			},
		],
	},
};
