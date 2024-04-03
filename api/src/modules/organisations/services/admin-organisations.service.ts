import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sortBy } from 'lodash';

import { DataService } from '../../data';
import { CustomError } from '../../shared/helpers/custom-error';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { isAvo } from '../../shared/helpers/is-avo';
import {
	BasicOrganisation,
	GqlAvoOrganisation,
	GqlHetArchiefOrganisation,
	GqlOrganisation,
	Organisation,
} from '../admin-organisations.types';
import { ORGANISATION_QUERIES, OrganisationQueryTypes } from '../queries/organization.queries';

@Injectable()
export class AdminOrganisationsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

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
			logo_url: hetArchiefOrganisation?.logo?.iri || avoOrganisation?.logo_url,
		};
	}

	public async getOrganisation(id: string): Promise<Organisation> {
		return await this.getOrganisations([id])[0];
	}

	public async getOrganisations(ids: string[]): Promise<Organisation[]> {
		const response = await this.dataService.execute<
			OrganisationQueryTypes['GetOrganisationsQuery'],
			OrganisationQueryTypes['GetOrganisationsQueryVariables']
		>(ORGANISATION_QUERIES[getDatabaseType()].GetOrganisationsDocument, {
			ids,
		});

		/* istanbul ignore next */
		return (
			(response as OrganisationQueryTypes['GetOrganisationsQueryAvo'])
				?.shared_organisations ||
			(response as OrganisationQueryTypes['GetOrganisationsQueryHetArchief'])
				?.maintainer_organisation ||
			[]
		).map(this.adapt);
	}

	public async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		try {
			const response = await this.dataService.execute<
				OrganisationQueryTypes['GetOrganisationsWithUsersQuery']
			>(ORGANISATION_QUERIES[getDatabaseType()].GetOrganisationsWithUsersDocument);

			let organisations;
			if (isAvo()) {
				organisations = (
					response as OrganisationQueryTypes['GetOrganisationsWithUsersQueryAvo']
				).shared_organisations_with_users;

				if (!organisations) {
					throw CustomError('Response does not contain any organisations', null, {
						response,
					});
				}
			} else {
				organisations = (
					response as OrganisationQueryTypes['GetOrganisationsWithUsersQueryHetArchief']
				).maintainer_organisation.map((maintainerWrap) => ({
					name: maintainerWrap.schema_name || undefined,
					or_id: maintainerWrap.schema_identifier,
				}));
			}

			return sortBy(organisations, 'name');
		} catch (err: any) {
			throw CustomError('Failed to get organisations from the database', err, {
				query: 'GetOrganisationsWithUsers',
			});
		}
	}
}
