module.exports = {
	setupFilesAfterEnv: ['<rootDir>/jest/jest.setup.js'],
	moduleNameMapper: {
		/* Handle CSS imports (with CSS modules)
		https://jestjs.io/docs/webpack#mocking-css-modules */
		'^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',

		// Handle CSS imports (without CSS modules)
		'^.+\\.(css|sass|scss)$': '<rootDir>/jest/__mocks__/style-mock.js',

		/* Handle image imports
		https://jestjs.io/docs/webpack#handling-static-assets */
		'^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': '<rootDir>/jest/__mocks__/file-mock.js',

		/* Handle deps */
		'^lodash-es$': '<rootDir>/node_modules/lodash/index.js',
	},
	roots: ['<rootDir>'],
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.jsx?$': require.resolve('babel-jest'),
		'^.+\\.tsx?$': 'ts-jest',
	},
	transformIgnorePatterns: ['/node_modules/(?!(ky))', '^.+\\.module\\.(css|sass|scss)$'],
};
