module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		tsconfigRootDir: __dirname,
	},
	env: {
		node: true,
		jest: true,
	},
	plugins: ['@typescript-eslint/eslint-plugin'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:prettier/recommended',
	],

	ignorePatterns: ['.eslintrc.js', 'jest*.config.js', './src/modules/shared/generated/'],
	rules: {
		'no-async-promise-executor': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{
				fixStyle: 'inline-type-imports',
			},
		],

		'import/first': 'error',
		'import/no-duplicates': 'error',
		'import/no-named-as-default': 'off',
		'import/no-named-as-default-member': 'off',
		'import/order': [
			'error',
			{
				alphabetize: { order: 'asc' },
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: '~*',
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
	settings: {
		'import/resolver': {
			typescript: {},
		},
	},
};
