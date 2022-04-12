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
					tsconfig: './tsconfig.json',
				}),
				commonjs(),
				terser(),
				visualizer({
					open: cliArgs['config-analyze'],
					filename: 'bundle-stats.html',
					title: '@meemoo/react-admin | Rollup Visualizer',
				}),
			],
			external: [
				'@hookform/resolvers/yup',
				'@meemoo/react-components',
				'clsx',
				'lodash-es',
				'ramda',
				'react-dom',
				'react-hook-form',
				'react-query',
				'react-router-dom',
				'react-router-guards',
				'react',
				'rxjs',
				'rxjs/operators',
				'yup',
			],
		},
	];
};
