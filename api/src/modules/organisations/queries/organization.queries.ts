import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';
import {
	GetOrganisationDocument as GetOrganisationDocumentAvo,
	GetOrganisationQuery as GetOrganisationQueryAvo,
	GetOrganisationQueryVariables as GetOrganisationQueryVariablesAvo,
	GetOrganisationsDocument as GetOrganisationsDocumentAvo,
	GetOrganisationsQuery as GetOrganisationsQueryAvo,
	GetOrganisationsQueryVariables as GetOrganisationsQueryVariablesAvo,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentAvo,
	GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryAvo,
} from '../../shared/generated/graphql-db-types-avo';

import {
	GetOrganisationDocument as GetOrganisationDocumentHetArchief,
	GetOrganisationQuery as GetOrganisationQueryHetArchief,
	GetOrganisationQueryVariables as GetOrganisationQueryVariablesHetArchief,
	GetOrganisationsDocument as GetOrganisationsDocumentHetArchief,
	GetOrganisationsQuery as GetOrganisationsQueryHetArchief,
	GetOrganisationsQueryVariables as GetOrganisationsQueryVariablesHetArchief,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentHetArchief,
	GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

export type OrganisationQueryTypes = {
	GetOrganisationQuery: GetOrganisationQueryAvo | GetOrganisationQueryHetArchief;
	GetOrganisationQueryAvo: GetOrganisationQueryAvo;
	GetOrganisationQueryHetArchief: GetOrganisationQueryHetArchief;
	GetOrganisationQueryVariables:
		| GetOrganisationQueryVariablesAvo
		| GetOrganisationQueryVariablesHetArchief;
	GetOrganisationQueryVariablesAvo: GetOrganisationQueryVariablesAvo;
	GetOrganisationQueryVariablesHetArchief: GetOrganisationQueryVariablesHetArchief;

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
	GetOrganisationDocument: TypedDocumentNode;
	GetOrganisationsDocument: TypedDocumentNode;
	GetOrganisationsWithUsersDocument: TypedDocumentNode;
};

export const ORGANISATION_QUERIES: Record<DatabaseType, OrganisationQueries> = {
	[DatabaseType.avo]: {
		GetOrganisationDocument: GetOrganisationDocumentAvo,
		GetOrganisationsDocument: GetOrganisationsDocumentAvo,
		GetOrganisationsWithUsersDocument: GetOrganisationsWithUsersDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetOrganisationDocument: GetOrganisationDocumentHetArchief,
		GetOrganisationsDocument: GetOrganisationsDocumentHetArchief,
		GetOrganisationsWithUsersDocument: GetOrganisationsWithUsersDocumentHetArchief,
	},
};
