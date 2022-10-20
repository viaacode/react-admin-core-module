import {
	GetOrganisationQuery as GetOrganisationQueryAvo,
	GetOrganisationQueryVariables as GetOrganisationQueryVariablesAvo,
} from '../shared/generated/graphql-db-types-avo';
import {
	GetOrganisationQuery as GetOrganisationQueryHetArchief,
	GetOrganisationQueryVariables as GetOrganisationQueryVariablesHetArchief,
} from '../shared/generated/graphql-db-types-hetarchief';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export interface Organisation {
	id: string;
	name: string;
	logo_url?: string;
}

export type OrganisationQueryTypes = {
	GetOrganisationQuery:
		| GetOrganisationQueryAvo
		| GetOrganisationQueryHetArchief;
	GetOrganisationQueryAvo: GetOrganisationQueryAvo;
	GetOrganisationQueryHetArchief: GetOrganisationQueryHetArchief;
	GetOrganisationQueryVariables:
		| GetOrganisationQueryVariablesAvo
		| GetOrganisationQueryVariablesHetArchief;
	GetOrganisationQueryVariablesAvo: GetOrganisationQueryVariablesAvo;
	GetOrganisationQueryVariablesHetArchief: GetOrganisationQueryVariablesHetArchief;
};

export type OrganisationQueries = {
	GetOrganisationDocument: TypedDocumentNode;
};

export type GqlAvoOrganisation =
	GetOrganisationQueryAvo['shared_organisations'][0];
export type GqlHetArchiefOrganisation =
	GetOrganisationQueryHetArchief['maintainer_content_partner'][0];
export type GqlOrganisation = GqlAvoOrganisation | GqlHetArchiefOrganisation;
