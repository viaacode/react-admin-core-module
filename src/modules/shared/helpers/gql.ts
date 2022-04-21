import { get } from 'lodash-es';

import { dataService, QueryInfo } from '../services/data-service';

import { CustomError } from './custom-error';

export const performQuery = async (
	query: QueryInfo,
	subResponse: [string, string] | [string] | null, // Avo and hetarchief paths
	error: string
): Promise<any> => {
	try {
		const response = await dataService.query(query);

		if (response.errors) {
			throw new CustomError('GraphQL response contains errors', null, { response });
		}

		if (subResponse) {
			let responseObject = null;
			if (subResponse[0]) {
				responseObject = get(response, subResponse[0], null);
			}
			if (subResponse[1]) {
				responseObject = responseObject || get(response, subResponse[1], null);
			}

			return responseObject;
		}

		return response;
	} catch (err) {
		throw new CustomError(error, err);
	}
};
