import { type GetOrganisationsQuery as GetOrganisationsQueryAvo } from '../shared/generated/graphql-db-types-avo';
import { type GetOrganisationsQuery as GetOrganisationsQueryHetArchief } from '../shared/generated/graphql-db-types-hetarchief';

export interface Organisation {
	id: string;
	name: string;
	logo_url?: string;
}

export interface MaintainerGridOrganisation {
	id: string;
	name: string;
	logoUrl: string;
	homepageUrl: string;
	slug: string;
}

export type BasicOrganisation = {
	or_id: string;
	name: string;
};

export type GqlAvoOrganisation = GetOrganisationsQueryAvo['shared_organisations'][0];
export type GqlHetArchiefOrganisation =
	GetOrganisationsQueryHetArchief['maintainer_organisation'][0];
export type GqlOrganisation = GqlAvoOrganisation | GqlHetArchiefOrganisation;
