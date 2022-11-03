import { forwardRef, Inject, Injectable } from "@nestjs/common";

import { ORGANISATION_QUERIES } from "../admin-organisations.consts";
import {
	GqlAvoOrganisation,
	GqlHetArchiefOrganisation,
	GqlOrganisation,
	Organisation,
	OrganisationQueries,
	OrganisationQueryTypes
} from "../admin-organisations.types";
import { DataService } from "../../data";

@Injectable()
export class AdminOrganisationsService {
	private queries: OrganisationQueries;

	constructor(
		@Inject(forwardRef(() => DataService)) protected dataService: DataService
	) {
		this.queries =
			ORGANISATION_QUERIES[process.env.DATABASE_APPLICATION_TYPE];
	}

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
				avoOrganisation?.logo_url
		};
	}

	public async getOrganisation(id: string): Promise<Organisation> {
		const response = await this.dataService.execute<OrganisationQueryTypes["GetOrganisationQuery"],
			OrganisationQueryTypes["GetOrganisationQueryVariables"]>(this.queries.GetOrganisationDocument, {
			id
		});

		/* istanbul ignore next */
		return this.adapt(
			(response as OrganisationQueryTypes["GetOrganisationQueryAvo"])
				?.shared_organisations?.[0] ||
			(response as OrganisationQueryTypes["GetOrganisationQueryHetArchief"])
				?.maintainer_content_partner?.[0]
		);
	}
}
