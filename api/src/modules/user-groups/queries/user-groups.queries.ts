import { DatabaseType } from '@viaa/avo2-types';
import {
	GetUserGroupsDocument as GetUserGroupsDocumentAvo,
	GetUserGroupsPermissionsDocument as GetUserGroupsPermissionsDocumentAvo,
	GetUserGroupsPermissionsQuery as GetUserGroupsPermissionsQueryAvo,
	GetUserGroupsPermissionsQueryVariables as GetUserGroupsPermissionsQueryVariablesAvo,
	GetUserGroupsQuery as GetUserGroupsQueryAvo,
	GetUserGroupsQueryVariables as GetUserGroupsQueryVariablesAvo,
	UpdateUserGroupsPermissionsDocument as UpdateUserGroupsPermissionsDocumentAvo,
	UpdateUserGroupsPermissionsMutation as UpdateUserGroupsPermissionsMutationAvo,
	UpdateUserGroupsPermissionsMutationVariables as UpdateUserGroupsPermissionsMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	GetUserGroupsDocument as GetUserGroupsDocumentHetArchief,
	GetUserGroupsPermissionsDocument as GetUserGroupsPermissionsDocumentHetArchief,
	GetUserGroupsPermissionsQuery as GetUserGroupsPermissionsQueryHetArchief,
	GetUserGroupsPermissionsQueryVariables as GetUserGroupsPermissionsQueryVariablesHetArchief,
	GetUserGroupsQuery as GetUserGroupsQueryHetArchief,
	GetUserGroupsQueryVariables as GetUserGroupsQueryVariablesHetArchief,
	UpdateUserGroupsPermissionsDocument as UpdateUserGroupsPermissionsDocumentHetArchief,
	UpdateUserGroupsPermissionsMutation as UpdateUserGroupsPermissionsMutationHetArchief,
	UpdateUserGroupsPermissionsMutationVariables as UpdateUserGroupsPermissionsMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

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
	GetUserGroupsDocument: TypedDocumentNode;
	GetUserGroupsPermissionsDocument: TypedDocumentNode;
	UpdateUserGroupsPermissionsDocument: TypedDocumentNode;
};

export const USER_GROUP_QUERIES: Record<DatabaseType, UserGroupsQueries> = {
	[DatabaseType.avo]: {
		GetUserGroupsPermissionsDocument: GetUserGroupsPermissionsDocumentAvo,
		GetUserGroupsDocument: GetUserGroupsDocumentAvo,
		UpdateUserGroupsPermissionsDocument: UpdateUserGroupsPermissionsDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetUserGroupsPermissionsDocument:
		GetUserGroupsPermissionsDocumentHetArchief,
		GetUserGroupsDocument: GetUserGroupsDocumentHetArchief,
		UpdateUserGroupsPermissionsDocument:
		UpdateUserGroupsPermissionsDocumentHetArchief,
	},
};
