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
	},
});
