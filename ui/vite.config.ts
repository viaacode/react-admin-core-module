import * as path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), viteTsconfigPaths(), dts(), externalizeDeps()],
	server: {
		port: 3400,
	},
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: '@meemoo/admin-core-ui',
			fileName: 'index',
			formats: ['es'],
		},
		sourcemap: true,
	},
	define: {
		// By default, Vite doesn't include shims for Node.js
		// necessary for rich text editor to work
		// https://github.com/vitejs/vite/discussions/5912#discussioncomment-5569850
		global: 'globalThis',
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
