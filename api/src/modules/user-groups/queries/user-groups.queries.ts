import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AvoCoreDatabaseType } from '@viaa/avo2-types';

import {
	GetUserGroupsDocument as GetUserGroupsDocumentAvo,
	GetUserGroupsPermissionsDocument as GetUserGroupsPermissionsDocumentAvo,
	type GetUserGroupsPermissionsQuery as GetUserGroupsPermissionsQueryAvo,
	type GetUserGroupsPermissionsQueryVariables as GetUserGroupsPermissionsQueryVariablesAvo,
	type GetUserGroupsQuery as GetUserGroupsQueryAvo,
	type GetUserGroupsQueryVariables as GetUserGroupsQueryVariablesAvo,
	UpdateUserGroupsPermissionsDocument as UpdateUserGroupsPermissionsDocumentAvo,
	type UpdateUserGroupsPermissionsMutation as UpdateUserGroupsPermissionsMutationAvo,
	type UpdateUserGroupsPermissionsMutationVariables as UpdateUserGroupsPermissionsMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetUserGroupsDocument as GetUserGroupsDocumentHetArchief,
	GetUserGroupsPermissionsDocument as GetUserGroupsPermissionsDocumentHetArchief,
	type GetUserGroupsPermissionsQuery as GetUserGroupsPermissionsQueryHetArchief,
	type GetUserGroupsPermissionsQueryVariables as GetUserGroupsPermissionsQueryVariablesHetArchief,
	type GetUserGroupsQuery as GetUserGroupsQueryHetArchief,
	type GetUserGroupsQueryVariables as GetUserGroupsQueryVariablesHetArchief,
	UpdateUserGroupsPermissionsDocument as UpdateUserGroupsPermissionsDocumentHetArchief,
	type UpdateUserGroupsPermissionsMutation as UpdateUserGroupsPermissionsMutationHetArchief,
	type UpdateUserGroupsPermissionsMutationVariables as UpdateUserGroupsPermissionsMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

export type UserGroupQueryTypes = {
	GetUserGroupsPermissionsQueryAvo: GetUserGroupsPermissionsQueryAvo;
	GetUserGroupsPermissionsQueryHetArchief: GetUserGroupsPermissionsQueryHetArchief;
	GetUserGroupsPermissionsQuery:
		| GetUserGroupsPermissionsQueryAvo
		| GetUserGroupsPermissionsQueryHetArchief;

	GetUserGroupsPermissionsQueryVariablesAvo: GetUserGroupsPermissionsQueryVariablesAvo;
	GetUserGroupsPermissionsQueryVariablesHetArchief: GetUserGroupsPermissionsQueryVariablesHetArchief;
	GetUserGroupsPermissionsQueryVariables:
		| GetUserGroupsPermissionsQueryVariablesAvo
		| GetUserGroupsPermissionsQueryVariablesHetArchief;

	GetUserGroupsQueryAvo: GetUserGroupsQueryAvo;
	GetUserGroupsQueryHetArchief: GetUserGroupsQueryHetArchief;
	GetUserGroupsQuery: GetUserGroupsQueryAvo | GetUserGroupsQueryHetArchief;

	GetUserGroupsQueryVariablesAvo: GetUserGroupsQueryVariablesAvo;
	GetUserGroupsQueryVariablesHetArchief: GetUserGroupsQueryVariablesHetArchief;
	GetUserGroupsQueryVariables:
		| GetUserGroupsQueryVariablesAvo
		| GetUserGroupsQueryVariablesHetArchief;

	UpdateUserGroupsPermissionsMutationAvo: UpdateUserGroupsPermissionsMutationAvo;
	UpdateUserGroupsPermissionsMutationHetArchief: UpdateUserGroupsPermissionsMutationHetArchief;
	UpdateUserGroupsPermissionsMutation:
		| UpdateUserGroupsPermissionsMutationAvo
		| UpdateUserGroupsPermissionsMutationHetArchief;

	UpdateUserGroupsPermissionsMutationVariablesAvo: UpdateUserGroupsPermissionsMutationVariablesAvo;
	UpdateUserGroupsPermissionsMutationVariablesHetArchief: UpdateUserGroupsPermissionsMutationVariablesHetArchief;
	UpdateUserGroupsPermissionsMutationVariables:
		| UpdateUserGroupsPermissionsMutationVariablesAvo
		| UpdateUserGroupsPermissionsMutationVariablesHetArchief;
};

type UserGroupsQueries = {
	GetUserGroupsDocument: TypedDocumentNode<any, any>;
	GetUserGroupsPermissionsDocument: TypedDocumentNode<any, any>;
	UpdateUserGroupsPermissionsDocument: TypedDocumentNode<any, any>;
};

export const USER_GROUP_QUERIES: Record<AvoCoreDatabaseType, UserGroupsQueries> = {
	[AvoCoreDatabaseType.avo]: {
		GetUserGroupsPermissionsDocument: GetUserGroupsPermissionsDocumentAvo,
		GetUserGroupsDocument: GetUserGroupsDocumentAvo,
		UpdateUserGroupsPermissionsDocument: UpdateUserGroupsPermissionsDocumentAvo,
	},
	[AvoCoreDatabaseType.hetArchief]: {
		GetUserGroupsPermissionsDocument: GetUserGroupsPermissionsDocumentHetArchief,
		GetUserGroupsDocument: GetUserGroupsDocumentHetArchief,
		UpdateUserGroupsPermissionsDocument: UpdateUserGroupsPermissionsDocumentHetArchief,
	},
};
