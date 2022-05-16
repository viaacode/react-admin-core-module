import { get, sortBy } from 'lodash-es';

import { Avo } from '@viaa/avo2-types';

import { Config } from '~core/config';
import { AvoOrHetArchief } from '~modules/shared/types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { dataService } from '../data-service';
import { GetOrganizationsWithUsersDocument } from '~generated/graphql-db-types-avo';

export class OrganisationService {
	public static async fetchOrganisationsWithUsers(): Promise<
		Partial<Avo.Organization.Organization>[]
	> {
		if(Config.getConfig().database.databaseApplicationType === AvoOrHetArchief.hetArchief) {
			return [];
		}

		try {
			const response = await dataService.query({ query: GetOrganizationsWithUsersDocument });

			if (response.errors) {
				throw new CustomError('GraphQL response contains errors', null, { response });
			}

			const organisations: Partial<Avo.Organization.Organization>[] | null = get(
				response,
				'data.shared_organisations_with_users'
			);

			if (!organisations) {
				throw new CustomError('Response does not contain any organisations', null, {
					response,
				});
			}

			return sortBy(organisations, 'name');
		} catch (err) {
			throw new CustomError('Failed to get organisations from the database', err, {
				query: 'GET_ORGANISATIONS_WITH_USERS',
			});
		}
	}
}
