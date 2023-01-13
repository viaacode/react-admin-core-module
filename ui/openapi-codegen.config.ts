import { generateSchemaTypes, generateReactQueryComponents } from '@openapi-codegen/typescript';
import { defineConfig } from '@openapi-codegen/cli';

export default defineConfig({
	server: {
		from: {
			source: 'url',
			url: 'http://localhost:3300/docs-json',
		},
		outputDir: './src/shared/generated',
		to: async (context: any) => {
			const filenamePrefix = 'server';
			const { schemasFiles } = await generateSchemaTypes(context, {
				filenamePrefix,
			});
			await generateReactQueryComponents(context, {
				filenamePrefix,
				schemasFiles,
			});
		},
	},
});
