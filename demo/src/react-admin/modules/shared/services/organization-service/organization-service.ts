import { get, sortBy } from 'lodash-es';

import { Avo } from '@viaa/avo2-types';

import { AdminConfigManager } from '~core/config';
import { AvoOrHetArchief } from '~modules/shared/types';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { dataService } from '../data-service';

import { ORGANIZATION_QUERIES } from './queries/organization.queries';
import { GetOrganizationsWithUsersQuery as GetOrganizationsWithUsersQueryAvo } from '~generated/graphql-db-types-avo';
import { GetOrganizationsWithUsersQuery as GetOrganizationsWithUsersQueryHetArchief } from '~generated/graphql-db-types-hetarchief';

export class OrganisationService {
	private static getQueries() {
		return ORGANIZATION_QUERIES[AdminConfigManager.getConfig().database.databaseApplicationType];
	}

	public static async fetchOrganisationsWithUsers(): Promise<
		Partial<Avo.Organization.Organization>[]
	> {
		try {
			const response = await dataService.query<
				GetOrganizationsWithUsersQueryAvo & GetOrganizationsWithUsersQueryHetArchief
			>({
				query: this.getQueries().GetOrganizationsWithUsersDocument,
			});

			if (response.errors) {
				throw new CustomError('GraphQL response contains errors', null, { response });
			}

			let organisations: Partial<Avo.Organization.Organization>[];
			if (AdminConfigManager.getConfig().database.databaseApplicationType === AvoOrHetArchief.avo) {
				organisations = get(response, 'data.shared_organisations_with_users');

				if (!organisations) {
					throw new CustomError('Response does not contain any organisations', null, {
						response,
					});
				}
			} else {
				organisations = (
					response.data as GetOrganizationsWithUsersQueryHetArchief
				).maintainer_users_profile.map((maintainerWrap) => ({
					name: maintainerWrap.maintainer.schema_name || undefined,
					or_id: maintainerWrap.maintainer.schema_identifier,
				}));
			}

			return sortBy(organisations, 'name');
		} catch (err) {
			throw new CustomError('Failed to get organisations from the database', err, {
				query: 'GET_ORGANISATIONS_WITH_USERS',
			});
		}
	}
}
