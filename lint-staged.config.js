module.exports = {
	"{api,ui}/**/*.{ts,tsx}": "eslint --ext .ts,.tsx --fix",
	"{api,ui}/src/**/*.{css,scss}": "stylelint --fix --allow-empty-input",
};
