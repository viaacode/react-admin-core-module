import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';

import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentAvo,
	type DeleteNavigationItemMutation as DeleteNavigationItemMutationAvo,
	type DeleteNavigationItemMutationVariables as DeleteNavigationItemMutationVariablesAvo,
	GetAllNavigationItemsDocument as GetAllNavigationItemsDocumentAvo,
	type GetAllNavigationItemsQuery as GetAllNavigationItemsQueryAvo,
	type GetAllNavigationItemsQueryVariables as GetAllNavigationItemsQueryVariablesAvo,
	GetNavigationBarsDocument as GetNavigationBarsDocumentAvo,
	type GetNavigationBarsQuery as GetNavigationBarsQueryAvo,
	type GetNavigationBarsQueryVariables as GetNavigationBarsQueryVariablesAvo,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentAvo,
	type GetNavigationItemByIdQuery as GetNavigationItemByIdQueryAvo,
	type GetNavigationItemByIdQueryVariables as GetNavigationItemByIdQueryVariablesAvo,
	GetNavigationItemsByPlacementAndLanguageDocument as GetNavigationItemsByPlacementAndLanguageDocumentAvo,
	type GetNavigationItemsByPlacementAndLanguageQuery as GetNavigationItemsByPlacementAndLanguageQueryAvo,
	type GetNavigationItemsByPlacementAndLanguageQueryVariables as GetNavigationItemsByPlacementAndLanguageQueryVariablesAvo,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentAvo,
	type GetNavigationItemsByPlacementQuery as GetNavigationItemsByPlacementQueryAvo,
	type GetNavigationItemsByPlacementQueryVariables as GetNavigationItemsByPlacementQueryVariablesAvo,
	InsertNavigationItemDocument as InsertNavigationItemDocumentAvo,
	type InsertNavigationItemMutation as InsertNavigationItemMutationAvo,
	type InsertNavigationItemMutationVariables as InsertNavigationItemMutationVariablesAvo,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentAvo,
	type UpdateNavigationItemByIdMutation as UpdateNavigationItemByIdMutationAvo,
	type UpdateNavigationItemByIdMutationVariables as UpdateNavigationItemByIdMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentHetArchief,
	type DeleteNavigationItemMutation as DeleteNavigationItemMutationHetArchief,
	type DeleteNavigationItemMutationVariables as DeleteNavigationItemMutationVariablesHetArchief,
	GetAllNavigationItemsDocument as GetAllNavigationItemsDocumentHetArchief,
	type GetAllNavigationItemsQuery as GetAllNavigationItemsQueryHetArchief,
	type GetAllNavigationItemsQueryVariables as GetAllNavigationItemsQueryVariablesHetArchief,
	GetNavigationBarsDocument as GetNavigationBarsDocumentHetArchief,
	type GetNavigationBarsQuery as GetNavigationBarsQueryHetArchief,
	type GetNavigationBarsQueryVariables as GetNavigationBarsQueryVariablesHetArchief,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentHetArchief,
	type GetNavigationItemByIdQuery as GetNavigationItemByIdQueryHetArchief,
	type GetNavigationItemByIdQueryVariables as GetNavigationItemByIdQueryVariablesHetArchief,
	GetNavigationItemsByPlacementAndLanguageDocument as GetNavigationItemsByPlacementAndLanguageDocumentHetArchief,
	type GetNavigationItemsByPlacementAndLanguageQuery as GetNavigationItemsByPlacementAndLanguageQueryHetArchief,
	type GetNavigationItemsByPlacementAndLanguageQueryVariables as GetNavigationItemsByPlacementAndLanguageQueryVariablesHetArchief,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentHetArchief,
	type GetNavigationItemsByPlacementQuery as GetNavigationItemsByPlacementQueryHetArchief,
	type GetNavigationItemsByPlacementQueryVariables as GetNavigationItemsByPlacementQueryVariablesHetArchief,
	InsertNavigationItemDocument as InsertNavigationItemDocumentHetArchief,
	type InsertNavigationItemMutation as InsertNavigationItemMutationHetArchief,
	type InsertNavigationItemMutationVariables as InsertNavigationItemMutationVariablesHetArchief,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentHetArchief,
	type UpdateNavigationItemByIdMutation as UpdateNavigationItemByIdMutationHetArchief,
	type UpdateNavigationItemByIdMutationVariables as UpdateNavigationItemByIdMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

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

	GetNavigationBarsQuery: GetNavigationBarsQueryAvo | GetNavigationBarsQueryHetArchief;
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

	GetAllNavigationItemsQuery:
		| GetAllNavigationItemsQueryAvo
		| GetAllNavigationItemsQueryHetArchief;
	GetAllNavigationItemsQueryVariables:
		| GetAllNavigationItemsQueryVariablesAvo
		| GetAllNavigationItemsQueryVariablesHetArchief;
	GetAllNavigationItemsQueryAvo: GetAllNavigationItemsQueryAvo;
	GetAllNavigationItemsQueryVariablesAvo: GetAllNavigationItemsQueryVariablesAvo;
	GetAllNavigationItemsQueryHetArchief: GetAllNavigationItemsQueryHetArchief;
	GetAllNavigationItemsQueryVariablesHetArchief: GetAllNavigationItemsQueryVariablesHetArchief;

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

	GetNavigationItemsByPlacementAndLanguageQuery:
		| GetNavigationItemsByPlacementAndLanguageQueryAvo
		| GetNavigationItemsByPlacementAndLanguageQueryHetArchief;
	GetNavigationItemsByPlacementAndLanguageQueryVariables:
		| GetNavigationItemsByPlacementAndLanguageQueryVariablesAvo
		| GetNavigationItemsByPlacementAndLanguageQueryVariablesHetArchief;
	GetNavigationItemsByPlacementAndLanguageQueryAvo: GetNavigationItemsByPlacementAndLanguageQueryAvo;
	GetNavigationItemsByPlacementAndLanguageQueryVariablesAvo: GetNavigationItemsByPlacementAndLanguageQueryVariablesAvo;
	GetNavigationItemsByPlacementAndLanguageQueryHetArchief: GetNavigationItemsByPlacementAndLanguageQueryHetArchief;
	GetNavigationItemsByPlacementAndLanguageQueryVariablesHetArchief: GetNavigationItemsByPlacementAndLanguageQueryVariablesHetArchief;

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
	DeleteNavigationItemDocument: TypedDocumentNode<any, any>;
	GetNavigationBarsDocument: TypedDocumentNode<any, any>;
	GetAllNavigationItemsDocument: TypedDocumentNode<any, any>;
	GetNavigationItemByIdDocument: TypedDocumentNode<any, any>;
	GetNavigationItemsByPlacementDocument: TypedDocumentNode<any, any>;
	GetNavigationItemsByPlacementAndLanguageDocument: TypedDocumentNode<any, any>;
	InsertNavigationItemDocument: TypedDocumentNode<any, any>;
	UpdateNavigationItemByIdDocument: TypedDocumentNode<any, any>;
};

export const NAVIGATION_QUERIES: Record<DatabaseType, NavigationQueries> = {
	[DatabaseType.avo]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentAvo,
		GetNavigationBarsDocument: GetNavigationBarsDocumentAvo,
		GetAllNavigationItemsDocument: GetAllNavigationItemsDocumentAvo,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentAvo,
		GetNavigationItemsByPlacementDocument: GetNavigationItemsByPlacementDocumentAvo,
		GetNavigationItemsByPlacementAndLanguageDocument:
			GetNavigationItemsByPlacementAndLanguageDocumentAvo,
		InsertNavigationItemDocument: InsertNavigationItemDocumentAvo,
		UpdateNavigationItemByIdDocument: UpdateNavigationItemByIdDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentHetArchief,
		GetNavigationBarsDocument: GetNavigationBarsDocumentHetArchief,
		GetAllNavigationItemsDocument: GetAllNavigationItemsDocumentHetArchief,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentHetArchief,
		GetNavigationItemsByPlacementDocument: GetNavigationItemsByPlacementDocumentHetArchief,
		GetNavigationItemsByPlacementAndLanguageDocument:
			GetNavigationItemsByPlacementAndLanguageDocumentHetArchief,
		InsertNavigationItemDocument: InsertNavigationItemDocumentHetArchief,
		UpdateNavigationItemByIdDocument: UpdateNavigationItemByIdDocumentHetArchief,
	},
};

export type NavigationEntry =
	| InsertNavigationItemMutationAvo['insert_app_content_nav_elements_one']
	| InsertNavigationItemMutationHetArchief['insert_app_navigation_one']
	| UpdateNavigationItemByIdMutationAvo['update_app_content_nav_elements_by_pk']
	| UpdateNavigationItemByIdMutationHetArchief['update_app_navigation_by_pk']
	| GetAllNavigationItemsQueryAvo['app_content_nav_elements'][0]
	| GetAllNavigationItemsQueryHetArchief['app_navigation'][0]
	| GetNavigationItemByIdQueryAvo['app_content_nav_elements'][0]
	| GetNavigationItemByIdQueryHetArchief['app_navigation'][0]
	| GetNavigationItemsByPlacementQueryAvo['app_content_nav_elements'][0]
	| GetNavigationItemsByPlacementQueryHetArchief['app_navigation'][0];
