import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

// It's possible to pass custom cli arguments through rollup
// For more info: https://rollupjs.org/guide/en/#configuration-files
export default (cliArgs) => {
	return [
		{
			input: ['src/react-admin/index.ts'],
			output: [
				{
					dir: 'dist/esm',
					format: 'esm',
				},
				{
					dir: 'dist/cjs',
					format: 'cjs',
				},
			],
			plugins: [
				postcss({
					extensions: ['.scss', '.css'],
					plugins: [autoprefixer()],
					minimize: true,
				}),
				typescript({
					clean: true,
					check: true,
					tsconfig: './tsconfig.build.json',
				}),
				commonjs(),
				terser(),
				visualizer({
					open: cliArgs['config-analyze'],
					filename: 'bundle-stats.html',
					title: '@meemoo/admin-core-ui | Rollup Visualizer',
				}),
			],
			external: [
				'@hookform/resolvers/yup',
				'@meemoo/react-components',
				'@viaa/avo2-components',
				'clsx',
				'file-saver',
				'moment',
				'query-string',
				'use-query-params',
				'sanitize-html',
				'react-select',
				'react-select/async',
				'react-select/creatable',
				'ky-universal',
				'react-copy-to-clipboard',
				'react-scrollbars-custom',
				'immer',
				'lodash-es',
				'react-dom',
				'react-hook-form',
				'react-query',
				'react',
				'react/jsx-runtime',
				'rxjs/operators',
				'yup',
			],
		},
	];
};
