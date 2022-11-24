import {
	GetPermissionsDocument as GetPermissionsDocumentAvo,
	GetPermissionsQuery as GetPermissionsQueryAvo,
} from '../shared/generated/graphql-db-types-avo';
import {
	GetPermissionsDocument as GetPermissionsDocumentHetArchief,
	GetPermissionsQuery as GetPermissionsQueryHetArchief,
} from '../shared/generated/graphql-db-types-hetarchief';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AvoOrHetArchief } from '../shared/types';

export type PermissionQueryTypes = {
	GetPermissionsQueryAvo: GetPermissionsQueryAvo;
	GetPermissionsQueryHetArchief: GetPermissionsQueryHetArchief;
	GetPermissionsQuery: GetPermissionsQueryAvo | GetPermissionsQueryHetArchief;
};

type PermissionsQueries = {
	GetPermissionsDocument: TypedDocumentNode;
};

export const PERMISSIONS_QUERIES: Record<AvoOrHetArchief, PermissionsQueries> =
	{
		[AvoOrHetArchief.avo]: {
			GetPermissionsDocument: GetPermissionsDocumentAvo,
		},
		[AvoOrHetArchief.hetArchief]: {
			GetPermissionsDocument: GetPermissionsDocumentHetArchief,
		},
	};
