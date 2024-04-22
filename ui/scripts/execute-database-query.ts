import fetch, { Headers } from 'node-fetch';

export async function executeDatabaseQuery(
	app: 'AVO' | 'HET_ARCHIEF',
	query: string,
	variables: any = {}
): Promise<any> {
	if (
		!process.env.GRAPHQL_URL_AVO ||
		!process.env.GRAPHQL_SECRET_AVO ||
		!process.env.GRAPHQL_URL_HETARCHIEF ||
		!process.env.GRAPHQL_SECRET_HETARCHIEF
	) {
		throw new Error(
			'Missing environment variables. One or more of these are missing: GRAPHQL_URL_AVO, GRAPHQL_SECRET_AVO, GRAPHQL_URL_HETARCHIEF, GRAPHQL_SECRET_HETARCHIEF'
		);
	}
	const graphQlUrl: string =
		app === 'AVO' ? process.env.GRAPHQL_URL_AVO : process.env.GRAPHQL_URL_HETARCHIEF;
	const graphQlPassword: string =
		app === 'HET_ARCHIEF'
			? process.env.GRAPHQL_SECRET_AVO
			: process.env.GRAPHQL_SECRET_HETARCHIEF;
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
