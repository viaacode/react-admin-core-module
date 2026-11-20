import { type CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	overwrite: true,
	schema: [
		{
			[process.env.GRAPHQL_URL]: {
				headers: {
					'x-hasura-admin-secret': process.env.GRAPHQL_SECRET,
				},
			},
		},
	],
	documents: ['src/modules/**/queries/avo/*.graphql'],
	generates: {
		'src/modules/shared/generated/graphql-db-types-avo.ts': {
			// typescript-operations v6 generates the input types and enums used by the operations itself,
			// adding the typescript plugin as well would generate duplicate types
			plugins: ['typescript-operations', 'typed-document-node'],
			config: {
				// Keep enums usable as values, eg: Lookup_Languages_Enum.Nl
				enumType: 'native',
				// Keep the codegen v5 behaviour for custom hasura scalars (uuid, timestamptz, jsonb, ...)
				defaultScalarType: 'any',
			},
		},
	},
};

export default config;
