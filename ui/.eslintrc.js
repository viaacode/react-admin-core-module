module.exports = {
	parserOptions: {
		tsconfigRootDir: __dirname,
		sourceType: 'module',
	},
	rules: {
		// Add type if only the typescript type or interface is imported
		'@typescript-eslint/consistent-type-imports': ['error', {}],
		quotes: ['error', 'single', { avoidEscape: true }],
	},
};
