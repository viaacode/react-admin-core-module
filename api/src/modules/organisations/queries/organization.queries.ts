import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';
import {
	GetOrganisationDocument as GetOrganisationDocumentAvo,
	GetOrganisationQuery as GetOrganisationQueryAvo,
	GetOrganisationQueryVariables as GetOrganisationQueryVariablesAvo,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentAvo,
	GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryAvo,
} from '../../shared/generated/graphql-db-types-avo';

import {
	GetOrganisationDocument as GetOrganisationDocumentHetArchief,
	GetOrganisationQuery as GetOrganisationQueryHetArchief,
	GetOrganisationQueryVariables as GetOrganisationQueryVariablesHetArchief,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentHetArchief,
	GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

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

	GetOrganisationsWithUsersQuery:
		| GetOrganisationsWithUsersQueryAvo
		| GetOrganisationsWithUsersQueryHetArchief;
	GetOrganisationsWithUsersQueryAvo: GetOrganisationsWithUsersQueryAvo;
	GetOrganisationsWithUsersQueryHetArchief: GetOrganisationsWithUsersQueryHetArchief;
};

type OrganisationQueries = {
	GetOrganisationDocument: TypedDocumentNode;
	GetOrganisationsWithUsersDocument: TypedDocumentNode;
};

export const ORGANISATION_QUERIES: Record<DatabaseType, OrganisationQueries> = {
	[DatabaseType.avo]: {
		GetOrganisationDocument: GetOrganisationDocumentAvo,
		GetOrganisationsWithUsersDocument: GetOrganisationsWithUsersDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetOrganisationDocument: GetOrganisationDocumentHetArchief,
		GetOrganisationsWithUsersDocument:
			GetOrganisationsWithUsersDocumentHetArchief,
	},
};
