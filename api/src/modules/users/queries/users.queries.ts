import { DatabaseType } from '@viaa/avo2-types';

import {
	GetIdpsDocument as GetIdpsDocumentAvo,
	GetIdpsQuery as GetIdpsQueryAvo,
	GetIdpsQueryVariables as GetIdpsQueryVariablesAvo,
	GetProfileIdsDocument as GetProfileIdsDocumentAvo,
	GetProfileIdsQuery as GetProfileIdsQueryAvo,
	GetProfileIdsQueryVariables as GetProfileIdsQueryVariablesAvo,
	GetProfileNamesDocument as GetProfileNamesDocumentAvo,
	GetProfileNamesQuery as GetProfileNamesQueryAvo,
	GetProfileNamesQueryVariables as GetProfileNamesQueryVariablesAvo,
	GetUsersDocument as GetUsersDocumentAvo,
	GetUsersQuery as GetUsersQueryAvo,
	GetUsersQueryVariables as GetUsersQueryVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetIdpsDocument as GetIdpsDocumentHetArchief,
	GetIdpsQuery as GetIdpsQueryHetArchief,
	GetIdpsQueryVariables as GetIdpsQueryVariablesHetArchief,
	GetProfileIdsDocument as GetProfileIdsDocumentHetArchief,
	GetProfileIdsQuery as GetProfileIdsQueryHetArchief,
	GetProfileIdsQueryVariables as GetProfileIdsQueryVariablesHetArchief,
	GetProfileNamesDocument as GetProfileNamesDocumentHetArchief,
	GetProfileNamesQuery as GetProfileNamesQueryHetArchief,
	GetProfileNamesQueryVariables as GetProfileNamesQueryVariablesHetArchief,
	GetUsersDocument as GetUsersDocumentHetArchief,
	GetUsersQuery as GetUsersQueryHetArchief,
	GetUsersQueryVariables as GetUsersQueryVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type UserQueryTypes = {
	GetProfileNamesQueryAvo: GetProfileNamesQueryAvo;
	GetProfileNamesQueryHetArchief: GetProfileNamesQueryHetArchief;
	GetProfileNamesQuery: GetProfileNamesQueryAvo | GetProfileNamesQueryHetArchief;
	GetUsersQueryAvo: GetUsersQueryAvo;
	GetUsersQueryHetArchief: GetUsersQueryHetArchief;
	GetUsersQuery: GetUsersQueryAvo | GetUsersQueryHetArchief;
	GetIdpsQueryAvo: GetIdpsQueryAvo;
	GetIdpsQueryHetArchief: GetIdpsQueryHetArchief;
	GetIdpsQuery: GetIdpsQueryAvo | GetIdpsQueryHetArchief;
	GetProfileIdsQueryAvo: GetProfileIdsQueryAvo;
	GetProfileIdsQueryHetArchief: GetProfileIdsQueryHetArchief;
	GetProfileIdsQuery: GetProfileIdsQueryAvo | GetProfileIdsQueryHetArchief;
	GetProfileNamesQueryVariablesAvo: GetProfileNamesQueryVariablesAvo;
	GetProfileNamesQueryVariablesHetArchief: GetProfileNamesQueryVariablesHetArchief;
	GetProfileNamesQueryVariables:
		| GetProfileNamesQueryVariablesAvo
		| GetProfileNamesQueryVariablesHetArchief;
	GetUsersQueryVariablesAvo: GetUsersQueryVariablesAvo;
	GetUsersQueryVariablesHetArchief: GetUsersQueryVariablesHetArchief;
	GetUsersQueryVariables: GetUsersQueryVariablesAvo | GetUsersQueryVariablesHetArchief;
	GetIdpsQueryVariablesAvo: GetIdpsQueryVariablesAvo;
	GetIdpsQueryVariablesHetArchief: GetIdpsQueryVariablesHetArchief;
	GetIdpsQueryVariables: GetIdpsQueryVariablesAvo | GetIdpsQueryVariablesHetArchief;
	GetProfileIdsQueryVariablesAvo: GetProfileIdsQueryVariablesAvo;
	GetProfileIdsQueryVariablesHetArchief: GetProfileIdsQueryVariablesHetArchief;
	GetProfileIdsQueryVariables:
		| GetProfileIdsQueryVariablesAvo
		| GetProfileIdsQueryVariablesHetArchief;
};

type UserQueries = {
	GetProfileNamesDocument: TypedDocumentNode<any, any>;
	GetUsersDocument: TypedDocumentNode<any, any>;
	GetIdpsDocument: TypedDocumentNode<any, any>;
	GetProfileIdsDocument: TypedDocumentNode<any, any>;
};

export const USER_QUERIES: Record<DatabaseType, UserQueries> = {
	[DatabaseType.avo]: {
		GetProfileNamesDocument: GetProfileNamesDocumentAvo,
		GetUsersDocument: GetUsersDocumentAvo,
		GetIdpsDocument: GetIdpsDocumentAvo,
		GetProfileIdsDocument: GetProfileIdsDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetProfileNamesDocument: GetProfileNamesDocumentHetArchief,
		GetUsersDocument: GetUsersDocumentHetArchief,
		GetIdpsDocument: GetIdpsDocumentHetArchief,
		GetProfileIdsDocument: GetProfileIdsDocumentHetArchief,
	},
};
