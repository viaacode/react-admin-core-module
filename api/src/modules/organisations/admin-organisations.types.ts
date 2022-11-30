import { GetOrganisationQuery as GetOrganisationQueryAvo } from '../shared/generated/graphql-db-types-avo';
import { GetOrganisationQuery as GetOrganisationQueryHetArchief } from '../shared/generated/graphql-db-types-hetarchief';

export interface Organisation {
	id: string;
	name: string;
	logo_url?: string;
}

export type BasicOrganisation = {
	or_id: string;
	name: string;
};

export type GqlAvoOrganisation =
	GetOrganisationQueryAvo['shared_organisations'][0];
export type GqlHetArchiefOrganisation =
	GetOrganisationQueryHetArchief['maintainer_content_partner'][0];
export type GqlOrganisation = GqlAvoOrganisation | GqlHetArchiefOrganisation;
