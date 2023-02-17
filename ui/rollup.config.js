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
			input: ['src/index.ts'],
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
				'@tanstack/react-query',
				'@viaa/avo2-components',
				'@viaa/avo2-types',
				'clsx',
				'dompurify',
				'file-saver',
				'html-entities',
				'immer',
				'lodash-es',
				'moment',
				'moment/locale/nl-be',
				'date-fns/locale',
				'date-fns',
				'classnames',
				'query-string',
				'react',
				'react-copy-to-clipboard',
				'react-dom',
				'react-router-dom',
				'react-hook-form',
				'react-scrollbars-custom',
				'react-select',
				'react-select/async',
				'react-select/creatable',
				'react/jsx-runtime',
				'rxjs/operators',
				'use-query-params',
				'yup',
			],
		},
	];
};
