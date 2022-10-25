import { Injectable } from '@nestjs/common';

import { DataService } from '../../data/services/data.service';
import {
	GetSiteVariableByNameDocument,
	GetSiteVariableByNameQuery,
	GetSiteVariableByNameQueryVariables,
	UpdateSiteVariableByNameDocument,
	UpdateSiteVariableByNameMutation,
	UpdateSiteVariableByNameMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { UpdateResponse } from '../../shared/types/types';

@Injectable()
export class SiteVariablesService {
	constructor(private dataService: DataService) {}

	public async getSiteVariable<T>(variable: string): Promise<T> {
		const response = await this.dataService.execute<
			GetSiteVariableByNameQuery,
			GetSiteVariableByNameQueryVariables
		>(GetSiteVariableByNameDocument, { name: variable });

		/* istanbul ignore next */
		return response?.app_config_by_pk?.value;
	}

	public async updateSiteVariable(
		variable: string,
		value: any,
	): Promise<UpdateResponse> {
		const response = await this.dataService.execute<
			UpdateSiteVariableByNameMutation,
			UpdateSiteVariableByNameMutationVariables
		>(UpdateSiteVariableByNameDocument, {
			name: variable,
			data: { value },
		});

		/* istanbul ignore next */
		return {
			affectedRows: response?.update_app_config?.affected_rows,
		};
	}
}
