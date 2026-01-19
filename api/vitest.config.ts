import { defineConfig } from 'vitest/config';

export default defineConfig({
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
