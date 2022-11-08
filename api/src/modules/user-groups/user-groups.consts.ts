import { AvoOrHetArchief } from '../content-pages';
import {
	GetUserGroupsPermissionsDocument as GetUserGroupsPermissionsDocumentAvo,
	GetUserGroupsPermissionsQuery as GetUserGroupsPermissionsQueryAvo,
	GetUserGroupsPermissionsQueryVariables as GetUserGroupsPermissionsQueryVariablesAvo,
	UpdateUserGroupsPermissionsDocument as UpdateUserGroupsPermissionsDocumentAvo,
	UpdateUserGroupsPermissionsMutation as UpdateUserGroupsPermissionsMutationAvo,
	UpdateUserGroupsPermissionsMutationVariables as UpdateUserGroupsPermissionsMutationVariablesAvo,
} from '../shared/generated/graphql-db-types-avo';
import {
	GetUserGroupsPermissionsDocument as GetUserGroupsPermissionsDocumentHetArchief,
	GetUserGroupsPermissionsQuery as GetUserGroupsPermissionsQueryHetArchief,
	GetUserGroupsPermissionsQueryVariables as GetUserGroupsPermissionsQueryVariablesHetArchief,
	UpdateUserGroupsPermissionsDocument as UpdateUserGroupsPermissionsDocumentHetArchief,
	UpdateUserGroupsPermissionsMutation as UpdateUserGroupsPermissionsMutationHetArchief,
	UpdateUserGroupsPermissionsMutationVariables as UpdateUserGroupsPermissionsMutationVariablesHetArchief,
} from '../shared/generated/graphql-db-types-hetarchief';
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
	GetUserGroupsPermissionsDocument: TypedDocumentNode;
	UpdateUserGroupsPermissionsDocument: TypedDocumentNode;
};

export const USER_GROUP_QUERIES: Record<AvoOrHetArchief, UserGroupsQueries> = {
	[AvoOrHetArchief.avo]: {
		GetUserGroupsPermissionsDocument: GetUserGroupsPermissionsDocumentAvo,
		UpdateUserGroupsPermissionsDocument: UpdateUserGroupsPermissionsDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetUserGroupsPermissionsDocument:
			GetUserGroupsPermissionsDocumentHetArchief,
		UpdateUserGroupsPermissionsDocument:
			UpdateUserGroupsPermissionsDocumentHetArchief,
	},
};
