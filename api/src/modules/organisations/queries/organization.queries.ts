import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';
import {
	GetOrganisationsDocument as GetOrganisationsDocumentAvo,
	GetOrganisationsQuery as GetOrganisationsQueryAvo,
	GetOrganisationsQueryVariables as GetOrganisationsQueryVariablesAvo,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentAvo,
	GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryAvo,
} from '../../shared/generated/graphql-db-types-avo';

import {
	GetOrganisationsDocument as GetOrganisationsDocumentHetArchief,
	GetOrganisationsQuery as GetOrganisationsQueryHetArchief,
	GetOrganisationsQueryVariables as GetOrganisationsQueryVariablesHetArchief,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentHetArchief,
	GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

export type OrganisationQueryTypes = {
	GetOrganisationsQuery: GetOrganisationsQueryAvo | GetOrganisationsQueryHetArchief;
	GetOrganisationsQueryAvo: GetOrganisationsQueryAvo;
	GetOrganisationsQueryHetArchief: GetOrganisationsQueryHetArchief;
	GetOrganisationsQueryVariables:
		| GetOrganisationsQueryVariablesAvo
		| GetOrganisationsQueryVariablesHetArchief;
	GetOrganisationsQueryVariablesAvo: GetOrganisationsQueryVariablesAvo;
	GetOrganisationsQueryVariablesHetArchief: GetOrganisationsQueryVariablesHetArchief;

	GetOrganisationsWithUsersQuery:
		| GetOrganisationsWithUsersQueryAvo
		| GetOrganisationsWithUsersQueryHetArchief;
	GetOrganisationsWithUsersQueryAvo: GetOrganisationsWithUsersQueryAvo;
	GetOrganisationsWithUsersQueryHetArchief: GetOrganisationsWithUsersQueryHetArchief;
};

type OrganisationQueries = {
	GetOrganisationsDocument: TypedDocumentNode;
	GetOrganisationsWithUsersDocument: TypedDocumentNode;
};

export const ORGANISATION_QUERIES: Record<DatabaseType, OrganisationQueries> = {
	[DatabaseType.avo]: {
		GetOrganisationsDocument: GetOrganisationsDocumentAvo,
		GetOrganisationsWithUsersDocument: GetOrganisationsWithUsersDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetOrganisationsDocument: GetOrganisationsDocumentHetArchief,
		GetOrganisationsWithUsersDocument: GetOrganisationsWithUsersDocumentHetArchief,
	},
};
