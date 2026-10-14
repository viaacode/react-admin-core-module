import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [swc.vite()],
	test: {
		setupFiles: ['./test/setup-tests.ts'],
		include: ['src/**/*.spec.ts'],
		environment: 'node',
		coverage: {
			provider: 'v8',
			include: ['src/**/*.{ts,js}'],
			reportsDirectory: './coverage',
		},
		globals: true,
	},
});
