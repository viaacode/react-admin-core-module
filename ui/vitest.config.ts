import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
	},
	resolve: {
		alias: {
			'~modules': resolve(__dirname, './src/react-admin/modules'),
			'~shared': resolve(__dirname, './src/react-admin/modules/shared'),
			'~content-blocks': resolve(
				__dirname,
				'./src/react-admin/modules/content-page/components/blocks'
			),
			'~generated': resolve(__dirname, './src/react-admin/generated'),
			'~core': resolve(__dirname, './src/react-admin/core'),
		}
	}
});
