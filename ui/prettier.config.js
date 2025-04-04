module.exports = {
	printWidth: 100,
	tabWidth: 4,
	trailingComma: 'es5',
	useTabs: true,
	endOfLine: 'auto',
	singleQuote: true,
	overrides: [
		{
			files: ['**/*.css', '**/*.scss', '**/*.html'],
			options: {
				singleQuote: false,
				printWidth: 1000,
				useTabs: true,
				tabWidth: 4,
			},
		},
		{
			files: ['src/**/*.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
};
