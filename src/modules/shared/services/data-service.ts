import { ApiService } from './api-service/api.service';
import { DATA_SERVICE_BASE_URL } from './data-service.consts';

export interface QueryInfo {
	query: string;
	variables?: any;
}

export interface GraphQlResponse<T> {
	data?: T;
	errors: any[];
}

export const dataService = {
	query: async <T>(queryInfo: QueryInfo): Promise<GraphQlResponse<T>> => {
		return ApiService.getApi()
			.post(DATA_SERVICE_BASE_URL, {
				body: JSON.stringify(queryInfo),
			})
			.json();
	},
};
