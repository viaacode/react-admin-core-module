import fetch, { Headers } from 'node-fetch';

export async function executeDatabaseQuery(
	app: 'AVO' | 'HET_ARCHIEF',
	query: string,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	variables: any = {},
	env: 'LOCAL' | 'QAS' = 'LOCAL'
	// biome-ignore lint/suspicious/noExplicitAny: todo
): Promise<any> {
	// We need the QAS database environment variables to fetch the latest translations and QAS is the "master" of all translations
	const envVars = {
		AVO: {
			LOCAL: {
				urlName: 'GRAPHQL_URL_AVO',
				url: process.env.GRAPHQL_URL_AVO,
				secretName: 'GRAPHQL_SECRET_AVO',
				secret: process.env.GRAPHQL_SECRET_AVO,
			},
			QAS: {
				urlName: 'GRAPHQL_URL_AVO_QAS',
				url: process.env.GRAPHQL_URL_AVO_QAS,
				secretName: 'GRAPHQL_SECRET_AVO_QAS',
				secret: process.env.GRAPHQL_SECRET_AVO_QAS,
			},
		},
		HET_ARCHIEF: {
			LOCAL: {
				urlName: 'GRAPHQL_URL_HETARCHIEF',
				url: process.env.GRAPHQL_URL_HETARCHIEF,
				secretName: 'GRAPHQL_SECRET_HETARCHIEF',
				secret: process.env.GRAPHQL_SECRET_HETARCHIEF,
			},
			QAS: {
				urlName: 'GRAPHQL_URL_HETARCHIEF_QAS',
				url: process.env.GRAPHQL_URL_HETARCHIEF_QAS,
				secretName: 'GRAPHQL_SECRET_HETARCHIEF_QAS',
				secret: process.env.GRAPHQL_SECRET_HETARCHIEF_QAS,
			},
		},
	};

	const { url: graphQlUrl, secret: graphQlPassword, urlName, secretName } = envVars[app][env];

	if (!graphQlUrl || !graphQlPassword) {
		throw new Error(
			`Missing environment variables. One or more of these are missing: ${urlName}, ${secretName}`
		);
	}
	const requestHeaders = new Headers();
	requestHeaders.append('Content-Type', 'application/json');
	requestHeaders.append('x-hasura-admin-secret', graphQlPassword);

	const raw = JSON.stringify({
		query,
		variables,
	});

	const requestOptions = {
		method: 'POST',
		headers: requestHeaders,
		body: raw,
	};

	const response = await fetch(graphQlUrl, requestOptions);
	return await response.json();
}
