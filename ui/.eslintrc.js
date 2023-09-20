module.exports = {
	parserOptions: {
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		rules: {
			'import/no-unresolved': [
				2,
				{
					ignore: ['@viaa', '@meemoo'],
				},
			],
			quotes: ['error', 'single', { avoidEscape: true }],
		},
	},
};
