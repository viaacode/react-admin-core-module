const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = override(
	addWebpackAlias({
		['~modules']: path.resolve(__dirname, './src/react-admin/modules'),
		['~shared']: path.resolve(__dirname, './src/react-admin/modules/shared'),
		['~content-blocks']: path.resolve(
			__dirname,
			'./src/react-admin/modules/content-page/components/blocks'
		),
		['~generated']: path.resolve(__dirname, './src/react-admin/generated'),
		['~core']: path.resolve(__dirname, './src/react-admin/core'),
	})
);
