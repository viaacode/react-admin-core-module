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
	documents: [
		'src/modules/**/queries/hetarchief/*.graphql',
		'src/modules/**/queries/hetarchief-and-avo/*.graphql',
	],
	generates: {
		'src/modules/shared/generated/graphql-db-types-hetarchief.ts': {
			plugins: ['typescript', 'typescript-operations', 'typed-document-node'],
		},
	},
};

export default config;
