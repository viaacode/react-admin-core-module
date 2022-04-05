module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'prettier',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
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

		'sort-imports': [
			'warn',
			{
				ignoreCase: true,
				ignoreDeclarationSort: true,
			},
		],
	},
	// env: {
	// 	node: true,
	// },
	// parser: '@typescript-eslint/parser',
	// plugins: ['@typescript-eslint'],
	// overrides: [
	// 	{
	// 		files: ['*.ts', '*.tsx'], // Your TypeScript files extension
	//
	// 		// As mentioned in the comments, you should extend TypeScript plugins here,
	// 		// instead of extending them outside the `overrides`.
	// 		// If you don't want to extend any rules, you don't need an `extends` attribute.
	// 		extends: [
	// 			'plugin:@typescript-eslint/recommended',
	// 			'plugin:@typescript-eslint/recommended-requiring-type-checking',
	// 		],
	//
	// 		parserOptions: {
	// 			project: ['./tsconfig.json'], // Specify it only for TypeScript files
	// 		},
	// 	},
	// ],
	// extends: [
	// 	'eslint:recommended',
	// 	'plugin:@typescript-eslint/recommended',
	// 	'plugin:@typescript-eslint/recommended-requiring-type-checking',
	// 	'plugin:import/recommended',
	// 	'plugin:import/errors',
	// 	'plugin:import/warnings',
	// 	'plugin:import/typescript',
	// 	'plugin:prettier/recommended',
	// 	'plugin:react-hooks/recommended',
	// ],
	// settings: {
	// 	'import/resolver': {
	// 		typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
	// 	},
	// },
	// ignorePatterns: ['./src/generated/*.ts', '*.js'],
	// rules: {
	// 	'@typescript-eslint/no-explicit-any': 'off',
	// 	'@typescript-eslint/explicit-module-boundary-types': 'off',
	// 	'@typescript-eslint/naming-convention': [
	// 		'error',
	// 		{
	// 			selector: 'interface',
	// 			format: ['PascalCase'],
	// 			custom: {
	// 				regex: '^I[A-Z]',
	// 				match: false,
	// 			},
	// 		},
	// 	],
	//
	// 	'import/first': 'error',
	// 	'import/no-duplicates': 'error',
	// 	'import/order': [
	// 		'warn',
	// 		{
	// 			alphabetize: {
	// 				order: 'asc',
	// 			},
	// 			'newlines-between': 'always',
	// 		},
	// 	],
	//
	// 	'sort-imports': [
	// 		'warn',
	// 		{
	// 			ignoreCase: true,
	// 			ignoreDeclarationSort: true,
	// 		},
	// 	],
	// },
};
