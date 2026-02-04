// biome-ignore-all lint/suspicious/noExplicitAny: any query
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AvoCoreDatabaseType } from '@viaa/avo2-types';

import {
	GetPermissionsDocument as GetPermissionsDocumentAvo,
	type GetPermissionsQuery as GetPermissionsQueryAvo,
} from '../shared/generated/graphql-db-types-avo';
import {
	GetPermissionsDocument as GetPermissionsDocumentHetArchief,
	type GetPermissionsQuery as GetPermissionsQueryHetArchief,
} from '../shared/generated/graphql-db-types-hetarchief';

export type PermissionQueryTypes = {
	GetPermissionsQueryAvo: GetPermissionsQueryAvo;
	GetPermissionsQueryHetArchief: GetPermissionsQueryHetArchief;
	GetPermissionsQuery: GetPermissionsQueryAvo | GetPermissionsQueryHetArchief;
};

type PermissionsQueries = {
	GetPermissionsDocument: TypedDocumentNode<any, any>;
};

export const PERMISSIONS_QUERIES: Record<AvoCoreDatabaseType, PermissionsQueries> = {
	[AvoCoreDatabaseType.avo]: {
		GetPermissionsDocument: GetPermissionsDocumentAvo,
	},
	[AvoCoreDatabaseType.hetArchief]: {
		GetPermissionsDocument: GetPermissionsDocumentHetArchief,
	},
};
