import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';

import {
	GetOrganisationsDocument as GetOrganisationsDocumentAvo,
	type GetOrganisationsQuery as GetOrganisationsQueryAvo,
	type GetOrganisationsQueryVariables as GetOrganisationsQueryVariablesAvo,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentAvo,
	type GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetOrganisationsDocument as GetOrganisationsDocumentHetArchief,
	type GetOrganisationsForMaintainerGridQuery as GetOrganisationsForMaintainerGridQueryArchief,
	type GetOrganisationsQuery as GetOrganisationsQueryHetArchief,
	type GetOrganisationsQueryVariables as GetOrganisationsQueryVariablesHetArchief,
	GetOrganisationsWithUsersDocument as GetOrganisationsWithUsersDocumentHetArchief,
	type GetOrganisationsWithUsersQuery as GetOrganisationsWithUsersQueryHetArchief,
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
	GetOrganisationsForMaintainerGridQuery: GetOrganisationsForMaintainerGridQueryArchief | undefined;
};

type OrganisationQueries = {
	GetOrganisationsDocument: TypedDocumentNode<any, any>;
	GetOrganisationsWithUsersDocument: TypedDocumentNode<any, any>;
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
