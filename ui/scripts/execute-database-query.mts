import fetch, { Headers } from "node-fetch";

export async function executeDatabaseQuery(
	app: "AVO" | "HET_ARCHIEF",
	query: string,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	variables: any = {},
	env: "LOCAL" | "QAS" = "LOCAL",
	// biome-ignore lint/suspicious/noExplicitAny: todo
): Promise<any> {
	if (
		env === "LOCAL" &&
		(!process.env.GRAPHQL_URL_AVO ||
			!process.env.GRAPHQL_SECRET_AVO ||
			!process.env.GRAPHQL_URL_HETARCHIEF ||
			!process.env.GRAPHQL_SECRET_HETARCHIEF)
	) {
		throw new Error(
			"Missing environment variables. One or more of these are missing: GRAPHQL_URL_AVO, GRAPHQL_SECRET_AVO, GRAPHQL_URL_HETARCHIEF, GRAPHQL_SECRET_HETARCHIEF",
		);
	}
	if (
		env === "QAS" &&
		(!process.env.GRAPHQL_URL_AVO_QAS ||
			!process.env.GRAPHQL_SECRET_AVO_QAS ||
			!process.env.GRAPHQL_URL_HETARCHIEF_QAS ||
			!process.env.GRAPHQL_SECRET_HETARCHIEF_QAS)
	) {
		throw new Error(
			"Missing environment variables. One or more of these are missing: GRAPHQL_URL_AVO_QAS, GRAPHQL_SECRET_AVO_QAS, GRAPHQL_URL_HETARCHIEF_QAS, GRAPHQL_SECRET_HETARCHIEF_QAS",
		);
	}
	let graphQlUrl = "";
	let graphQlPassword = "";
	if (env === "QAS") {
		if (env === "QAS") {
			// We need the QAS database environment variables to fetch the latest translations and QAS is the "master" of all translations
			if (app === "AVO") {
				graphQlUrl = process.env.GRAPHQL_URL_AVO_QAS as string;
				graphQlPassword = process.env.GRAPHQL_SECRET_AVO_QAS as string;
			} else {
				graphQlUrl = process.env.GRAPHQL_URL_HETARCHIEF_QAS as string;
				graphQlPassword = process.env.GRAPHQL_SECRET_HETARCHIEF_QAS as string;
			}
		}
	} else {
		if (app === "AVO") {
			graphQlUrl = process.env.GRAPHQL_URL_AVO as string;
			graphQlPassword = process.env.GRAPHQL_SECRET_AVO as string;
		} else {
			graphQlUrl = process.env.GRAPHQL_URL_HETARCHIEF as string;
			graphQlPassword = process.env.GRAPHQL_SECRET_HETARCHIEF as string;
		}
	}
	const requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("x-hasura-admin-secret", graphQlPassword);

	const raw = JSON.stringify({
		query,
		variables,
	});

	const requestOptions = {
		method: "POST",
		headers: requestHeaders,
		body: raw,
	};

	const response = await fetch(graphQlUrl, requestOptions);
	return await response.json();
}
