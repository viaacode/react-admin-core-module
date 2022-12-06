import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentAvo,
	DeleteNavigationItemMutation as DeleteNavigationItemMutationAvo,
	DeleteNavigationItemMutationVariables as DeleteNavigationItemMutationVariablesAvo,
	GetNavigationBarsDocument as GetNavigationBarsDocumentAvo,
	GetNavigationBarsQuery as GetNavigationBarsQueryAvo,
	GetNavigationBarsQueryVariables as GetNavigationBarsQueryVariablesAvo,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentAvo,
	GetNavigationItemByIdQuery as GetNavigationItemByIdQueryAvo,
	GetNavigationItemByIdQueryVariables as GetNavigationItemByIdQueryVariablesAvo,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentAvo,
	GetNavigationItemsByPlacementQuery as GetNavigationItemsByPlacementQueryAvo,
	GetNavigationItemsByPlacementQueryVariables as GetNavigationItemsByPlacementQueryVariablesAvo,
	InsertNavigationItemDocument as InsertNavigationItemDocumentAvo,
	InsertNavigationItemMutation as InsertNavigationItemMutationAvo,
	InsertNavigationItemMutationVariables as InsertNavigationItemMutationVariablesAvo,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentAvo,
	UpdateNavigationItemByIdMutation as UpdateNavigationItemByIdMutationAvo,
	UpdateNavigationItemByIdMutationVariables as UpdateNavigationItemByIdMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentHetArchief,
	DeleteNavigationItemMutation as DeleteNavigationItemMutationHetArchief,
	DeleteNavigationItemMutationVariables as DeleteNavigationItemMutationVariablesHetArchief,
	GetNavigationBarsDocument as GetNavigationBarsDocumentHetArchief,
	GetNavigationBarsQuery as GetNavigationBarsQueryHetArchief,
	GetNavigationBarsQueryVariables as GetNavigationBarsQueryVariablesHetArchief,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentHetArchief,
	GetNavigationItemByIdQuery as GetNavigationItemByIdQueryHetArchief,
	GetNavigationItemByIdQueryVariables as GetNavigationItemByIdQueryVariablesHetArchief,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentHetArchief,
	GetNavigationItemsByPlacementQuery as GetNavigationItemsByPlacementQueryHetArchief,
	GetNavigationItemsByPlacementQueryVariables as GetNavigationItemsByPlacementQueryVariablesHetArchief,
	InsertNavigationItemDocument as InsertNavigationItemDocumentHetArchief,
	InsertNavigationItemMutation as InsertNavigationItemMutationHetArchief,
	InsertNavigationItemMutationVariables as InsertNavigationItemMutationVariablesHetArchief,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentHetArchief,
	UpdateNavigationItemByIdMutation as UpdateNavigationItemByIdMutationHetArchief,
	UpdateNavigationItemByIdMutationVariables as UpdateNavigationItemByIdMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { DatabaseType } from '@viaa/avo2-types';

export type NavigationQueryTypes = {
	DeleteNavigationItemMutation:
		| DeleteNavigationItemMutationAvo
		| DeleteNavigationItemMutationHetArchief;
	DeleteNavigationItemMutationVariables:
		| DeleteNavigationItemMutationVariablesAvo
		| DeleteNavigationItemMutationVariablesHetArchief;
	DeleteNavigationItemMutationAvo: DeleteNavigationItemMutationAvo;
	DeleteNavigationItemMutationVariablesAvo: DeleteNavigationItemMutationVariablesAvo;
	DeleteNavigationItemMutationHetArchief: DeleteNavigationItemMutationHetArchief;
	DeleteNavigationItemMutationVariablesHetArchief: DeleteNavigationItemMutationVariablesHetArchief;

	GetNavigationBarsQuery:
		| GetNavigationBarsQueryAvo
		| GetNavigationBarsQueryHetArchief;
	GetNavigationBarsQueryVariables:
		| GetNavigationBarsQueryVariablesAvo
		| GetNavigationBarsQueryVariablesHetArchief;
	GetNavigationBarsQueryAvo: GetNavigationBarsQueryAvo;
	GetNavigationBarsQueryVariablesAvo: GetNavigationBarsQueryVariablesAvo;
	GetNavigationBarsQueryHetArchief: GetNavigationBarsQueryHetArchief;
	GetNavigationBarsQueryVariablesHetArchief: GetNavigationBarsQueryVariablesHetArchief;

	GetNavigationItemByIdQuery:
		| GetNavigationItemByIdQueryAvo
		| GetNavigationItemByIdQueryHetArchief;
	GetNavigationItemByIdQueryVariables:
		| GetNavigationItemByIdQueryVariablesAvo
		| GetNavigationItemByIdQueryVariablesHetArchief;
	GetNavigationItemByIdQueryAvo: GetNavigationItemByIdQueryAvo;
	GetNavigationItemByIdQueryVariablesAvo: GetNavigationItemByIdQueryVariablesAvo;
	GetNavigationItemByIdQueryHetArchief: GetNavigationItemByIdQueryHetArchief;
	GetNavigationItemByIdQueryVariablesHetArchief: GetNavigationItemByIdQueryVariablesHetArchief;

	GetNavigationItemsByPlacementQuery:
		| GetNavigationItemsByPlacementQueryAvo
		| GetNavigationItemsByPlacementQueryHetArchief;
	GetNavigationItemsByPlacementQueryVariables:
		| GetNavigationItemsByPlacementQueryVariablesAvo
		| GetNavigationItemsByPlacementQueryVariablesHetArchief;
	GetNavigationItemsByPlacementQueryAvo: GetNavigationItemsByPlacementQueryAvo;
	GetNavigationItemsByPlacementQueryVariablesAvo: GetNavigationItemsByPlacementQueryVariablesAvo;
	GetNavigationItemsByPlacementQueryHetArchief: GetNavigationItemsByPlacementQueryHetArchief;
	GetNavigationItemsByPlacementQueryVariablesHetArchief: GetNavigationItemsByPlacementQueryVariablesHetArchief;

	InsertNavigationItemMutation:
		| InsertNavigationItemMutationAvo
		| InsertNavigationItemMutationHetArchief;
	InsertNavigationItemMutationVariables:
		| InsertNavigationItemMutationVariablesAvo
		| InsertNavigationItemMutationVariablesHetArchief;
	InsertNavigationItemMutationAvo: InsertNavigationItemMutationAvo;
	InsertNavigationItemMutationVariablesAvo: InsertNavigationItemMutationVariablesAvo;
	InsertNavigationItemMutationHetArchief: InsertNavigationItemMutationHetArchief;
	InsertNavigationItemMutationVariablesHetArchief: InsertNavigationItemMutationVariablesHetArchief;

	UpdateNavigationItemByIdMutation:
		| UpdateNavigationItemByIdMutationAvo
		| UpdateNavigationItemByIdMutationHetArchief;
	UpdateNavigationItemByIdMutationVariables:
		| UpdateNavigationItemByIdMutationVariablesAvo
		| UpdateNavigationItemByIdMutationVariablesHetArchief;
	UpdateNavigationItemByIdMutationAvo: UpdateNavigationItemByIdMutationAvo;
	UpdateNavigationItemByIdMutationVariablesAvo: UpdateNavigationItemByIdMutationVariablesAvo;
	UpdateNavigationItemByIdMutationHetArchief: UpdateNavigationItemByIdMutationHetArchief;
	UpdateNavigationItemByIdMutationVariablesHetArchief: UpdateNavigationItemByIdMutationVariablesHetArchief;
};

type NavigationQueries = {
	DeleteNavigationItemDocument: TypedDocumentNode;
	GetNavigationBarsDocument: TypedDocumentNode;
	GetNavigationItemByIdDocument: TypedDocumentNode;
	GetNavigationItemsByPlacementDocument: TypedDocumentNode;
	InsertNavigationItemDocument: TypedDocumentNode;
	UpdateNavigationItemByIdDocument: TypedDocumentNode;
};

export const NAVIGATION_QUERIES: Record<DatabaseType, NavigationQueries> = {
	[DatabaseType.avo]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentAvo,
		GetNavigationBarsDocument: GetNavigationBarsDocumentAvo,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentAvo,
		GetNavigationItemsByPlacementDocument:
			GetNavigationItemsByPlacementDocumentAvo,
		InsertNavigationItemDocument: InsertNavigationItemDocumentAvo,
		UpdateNavigationItemByIdDocument: UpdateNavigationItemByIdDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentHetArchief,
		GetNavigationBarsDocument: GetNavigationBarsDocumentHetArchief,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentHetArchief,
		GetNavigationItemsByPlacementDocument:
			GetNavigationItemsByPlacementDocumentHetArchief,
		InsertNavigationItemDocument: InsertNavigationItemDocumentHetArchief,
		UpdateNavigationItemByIdDocument:
			UpdateNavigationItemByIdDocumentHetArchief,
	},
};

export type NavigationEntry =
	| InsertNavigationItemMutationAvo['insert_app_content_nav_elements_one']
	| InsertNavigationItemMutationHetArchief['insert_app_navigation_one']
	| UpdateNavigationItemByIdMutationAvo['update_app_content_nav_elements_by_pk']
	| UpdateNavigationItemByIdMutationHetArchief['update_app_navigation_by_pk']
	| GetNavigationItemByIdQueryAvo['app_content_nav_elements'][0]
	| GetNavigationItemByIdQueryHetArchief['app_navigation'][0];
