module.exports = {
	parserOptions: {
		project: 'tsconfig.build.json',
		tsconfigRootDir: __dirname,
		sourceType: 'module',
		rules: {
			'import/no-unresolved': [
				2,
				{
					ignore: ['@viaa', '@meemoo'],
				},
			],
		},
	},
	ignorePatterns: ['src/shared/generated/*.ts'],
};
