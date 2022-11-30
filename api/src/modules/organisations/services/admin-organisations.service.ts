import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CustomError } from '../../shared/helpers/custom-error';
import { AvoOrHetArchief } from '../../shared/types';

import {
	BasicOrganisation,
	GqlAvoOrganisation,
	GqlHetArchiefOrganisation,
	GqlOrganisation,
	Organisation,
} from '../admin-organisations.types';
import { DataService } from '../../data';
import {
	ORGANISATION_QUERIES,
	OrganisationQueryTypes,
} from '../queries/organization.queries';
import { sortBy } from 'lodash';

@Injectable()
export class AdminOrganisationsService {
	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService,
	) {}

	public adapt(gqlOrganisation: GqlOrganisation): Organisation {
		if (!gqlOrganisation) {
			return null;
		}
		const avoOrganisation = gqlOrganisation as GqlAvoOrganisation;
		const hetArchiefOrganisation = gqlOrganisation as GqlHetArchiefOrganisation;

		/* istanbul ignore next */
		return {
			id: hetArchiefOrganisation?.schema_identifier || avoOrganisation?.or_id,
			name: hetArchiefOrganisation?.schema_name || avoOrganisation?.name,
			logo_url:
				hetArchiefOrganisation?.information?.logo?.iri ||
				avoOrganisation?.logo_url,
		};
	}

	public async getOrganisation(id: string): Promise<Organisation> {
		const response = await this.dataService.execute<
			OrganisationQueryTypes['GetOrganisationQuery'],
			OrganisationQueryTypes['GetOrganisationQueryVariables']
		>(
			ORGANISATION_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.GetOrganisationDocument,
			{
				id,
			},
		);

		/* istanbul ignore next */
		return this.adapt(
			(response as OrganisationQueryTypes['GetOrganisationQueryAvo'])
				?.shared_organisations?.[0] ||
				(response as OrganisationQueryTypes['GetOrganisationQueryHetArchief'])
					?.maintainer_content_partner?.[0],
		);
	}

	public async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		try {
			const response = await this.dataService.execute<
				OrganisationQueryTypes['GetOrganisationsWithUsersQuery']
			>(
				ORGANISATION_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
					.GetOrganizationsWithUsersDocument,
			);

			let organisations;
			if (process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.avo) {
				organisations = (
					response as OrganisationQueryTypes['GetOrganisationsWithUsersQueryAvo']
				).shared_organisations_with_users;

				if (!organisations) {
					throw CustomError(
						'Response does not contain any organisations',
						null,
						{
							response,
						},
					);
				}
			} else {
				organisations = (
					response as OrganisationQueryTypes['GetOrganisationsWithUsersQueryHetArchief']
				).maintainer_users_profile.map((maintainerWrap) => ({
					name: maintainerWrap.maintainer.schema_name || undefined,
					or_id: maintainerWrap.maintainer.schema_identifier,
				}));
			}

			return sortBy(organisations, 'name');
		} catch (err) {
			throw CustomError('Failed to get organisations from the database', err, {
				query: 'GET_ORGANISATIONS_WITH_USERS',
			});
		}
	}
}
