import { ApiService } from './api-service/api.service';
import { DATA_SERVICE_BASE_URL } from './data-service.consts';
import { CustomError } from '~modules/shared/helpers/custom-error';

export interface QueryInfo<QueryVariablesType> {
	query: string;
	variables?: QueryVariablesType;
}

export interface GraphQlResponse<T> {
	data?: T;
	errors: any[];
}

export const dataService = {
	query: async <QueryType, QueryVariablesType = void>(
		queryInfo: QueryInfo<QueryVariablesType>
	): Promise<QueryType> => {
		const response = (await ApiService.getApi()
			.post(DATA_SERVICE_BASE_URL, {
				body: JSON.stringify(queryInfo),
			})
			.json()) as GraphQlResponse<QueryType>;

		if (response.errors) {
			const { message } = response.errors[0] || {};
			throw new CustomError(message || 'Error', response.errors, { ...queryInfo });
		}

		return response.data as QueryType;
	},
};
