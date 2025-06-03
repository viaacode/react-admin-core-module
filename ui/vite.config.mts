import * as path from 'path';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), viteTsconfigPaths(), dts(), externalizeDeps(), cssInjectedByJsPlugin()],
	server: {
		port: 3400,
	},
	build: {
		lib: {
			entry: {
				// Contains all the code that is needed to render the admin-core dashboard pages and edit pages
				admin: resolve(__dirname, 'src/admin.mts'),
				// Contains all the logic to render content pages and set the admin-core config
				client: resolve(__dirname, 'src/client.mts'),
			},
			name: '@meemoo/admin-core-ui',
			fileName: (_, entryName) => {
				if (entryName === 'src/index') {
					return 'index.mjs';
				}
				return `${entryName}.mjs`;
			},
			formats: ['es'],
		},
		rollupOptions: {
			output: {
				entryFileNames: '[name].mjs',
				preserveModules: true,
			},
		},
		sourcemap: true,
	},
	define: {
		// By default, Vite doesn't include shims for Node.js
		// necessary for rich text editor to work
		// https://github.com/vitejs/vite/discussions/5912#discussioncomment-5569850
		global: 'globalThis',
		'import.meta.env.DATABASE_APPLICATION_TYPE': JSON.stringify(
			process.env.DATABASE_APPLICATION_TYPE
		),
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'public'),
			'~modules': path.resolve(__dirname, './src/react-admin/modules'),
			'~shared': path.resolve(__dirname, './src/react-admin/modules/shared'),
			'~content-blocks': path.resolve(
				__dirname,
				'./src/react-admin/modules/content-page/components/blocks'
			),
			'~generated': path.resolve(__dirname, './src/react-admin/generated'),
			'~core': path.resolve(__dirname, './src/react-admin/core'),
		},
	},
});
