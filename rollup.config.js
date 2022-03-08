import commonjs from '@rollup/plugin-commonjs';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { visualizer } from 'rollup-plugin-visualizer';

const getOutput = (path, root = 'dist') => {
	const formats = ['esm', 'cjs'];

	return formats.map((format) => ({
		dir: path ? `${root}/${path}/${format}` : `${root}/${format}`,
		format,
	}));
};

// It's possible to pass custom cli arguments through rollup
// For more info: https://rollupjs.org/guide/en/#configuration-files
export default (cliArgs) => {
	return [
		{
			input: ['src/index.ts'],
			output: getOutput(),
			plugins: [
				postcss({
					extensions: ['.scss', '.css'],
					plugins: [autoprefixer()],
					minimize: true,
				}),
				typescript({
					clean: true,
					check: true,
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
				'clsx',
				'ramda',
				'react-dom',
				'react-router-dom',
				'react-router-guards',
				'react',
				'rxjs',
				'rxjs/operators',
			],
		},
	];
};
