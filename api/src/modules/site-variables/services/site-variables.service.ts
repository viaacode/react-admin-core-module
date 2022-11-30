import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { DataService } from '../../data';
import { UpdateResponse } from '../../shared/types/types';
import {
	SITE_VARIABLE_QUERIES,
	SiteVariableQueryTypes,
} from '../site-variables.consts';

@Injectable()
export class SiteVariablesService {
	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
	) {}

	public async getSiteVariable<T>(variable: string): Promise<T> {
		const response = await this.dataService.execute<
			SiteVariableQueryTypes['GetSiteVariableByNameQuery'],
			SiteVariableQueryTypes['GetSiteVariableByNameQueryVariables']
		>(
			SITE_VARIABLE_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.GetSiteVariableByNameDocument,
			{
				name: variable,
			},
		);

		/* istanbul ignore next */
		return (
			(response as SiteVariableQueryTypes['GetSiteVariableByNameQueryAvo'])
				?.app_site_variables_by_pk?.value ||
			(
				response as SiteVariableQueryTypes['GetSiteVariableByNameQueryHetArchief']
			)?.app_config_by_pk?.value
		);
	}

	public async updateSiteVariable(
		variable: string,
		value: any,
	): Promise<UpdateResponse> {
		const response = await this.dataService.execute<
			SiteVariableQueryTypes['UpdateSiteVariableByNameMutation'],
			SiteVariableQueryTypes['UpdateSiteVariableByNameMutationVariables']
		>(
			SITE_VARIABLE_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.UpdateSiteVariableByNameDocument,
			{
				name: variable,
				data: { value },
			},
		);

		/* istanbul ignore next */
		return {
			affectedRows:
				(
					response as SiteVariableQueryTypes['UpdateSiteVariableByNameMutationAvo']
				)?.update_app_site_variables?.affected_rows ||
				(
					response as SiteVariableQueryTypes['UpdateSiteVariableByNameMutationHetArchief']
				)?.update_app_config?.affected_rows ||
				0,
		};
	}
}
