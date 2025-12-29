import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AvoCoreDatabaseType } from '@viaa/avo2-types';

import {
	GetIdpsDocument as GetIdpsDocumentAvo,
	type GetIdpsQuery as GetIdpsQueryAvo,
	type GetIdpsQueryVariables as GetIdpsQueryVariablesAvo,
	GetProfileIdsDocument as GetProfileIdsDocumentAvo,
	type GetProfileIdsQuery as GetProfileIdsQueryAvo,
	type GetProfileIdsQueryVariables as GetProfileIdsQueryVariablesAvo,
	GetProfileNamesDocument as GetProfileNamesDocumentAvo,
	type GetProfileNamesQuery as GetProfileNamesQueryAvo,
	type GetProfileNamesQueryVariables as GetProfileNamesQueryVariablesAvo,
	GetUsersDocument as GetUsersDocumentAvo,
	type GetUsersQuery as GetUsersQueryAvo,
	type GetUsersQueryVariables as GetUsersQueryVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetIdpsDocument as GetIdpsDocumentHetArchief,
	type GetIdpsQuery as GetIdpsQueryHetArchief,
	type GetIdpsQueryVariables as GetIdpsQueryVariablesHetArchief,
	GetProfileIdsDocument as GetProfileIdsDocumentHetArchief,
	type GetProfileIdsQuery as GetProfileIdsQueryHetArchief,
	type GetProfileIdsQueryVariables as GetProfileIdsQueryVariablesHetArchief,
	GetProfileNamesDocument as GetProfileNamesDocumentHetArchief,
	type GetProfileNamesQuery as GetProfileNamesQueryHetArchief,
	type GetProfileNamesQueryVariables as GetProfileNamesQueryVariablesHetArchief,
	GetUsersDocument as GetUsersDocumentHetArchief,
	type GetUsersQuery as GetUsersQueryHetArchief,
	type GetUsersQueryVariables as GetUsersQueryVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

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

export const USER_QUERIES: Record<AvoCoreDatabaseType, UserQueries> = {
	[AvoCoreDatabaseType.avo]: {
		GetProfileNamesDocument: GetProfileNamesDocumentAvo,
		GetUsersDocument: GetUsersDocumentAvo,
		GetIdpsDocument: GetIdpsDocumentAvo,
		GetProfileIdsDocument: GetProfileIdsDocumentAvo,
	},
	[AvoCoreDatabaseType.hetArchief]: {
		GetProfileNamesDocument: GetProfileNamesDocumentHetArchief,
		GetUsersDocument: GetUsersDocumentHetArchief,
		GetIdpsDocument: GetIdpsDocumentHetArchief,
		GetProfileIdsDocument: GetProfileIdsDocumentHetArchief,
	},
};
