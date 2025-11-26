import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
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
			entry: {
				// Contains all the code that is needed to render the admin-core dashboard pages and edit pages
				'src/admin': resolve(__dirname, 'src/admin.ts'),
				// Contains all the logic to render content pages and set the admin-core config
				'src/client': resolve(__dirname, 'src/client.ts'),
			},
			formats: ['es'],
		},
		outDir: 'dist',
		rollupOptions: {
			output: {
				preserveModules: true,
			},
		},
		sourcemap: true,
		cssCodeSplit: true
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
			'@': resolve(__dirname, 'public'),
			'~modules': resolve(__dirname, './src/react-admin/modules'),
			'~shared': resolve(__dirname, './src/react-admin/modules/shared'),
			'~content-blocks': resolve(
				__dirname,
				'./src/react-admin/modules/content-page/components/blocks'
			),
			'~generated': resolve(__dirname, './src/react-admin/generated'),
			'~core': resolve(__dirname, './src/react-admin/core'),
		},
	},
});
