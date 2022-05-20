import { AvoOrHetArchief } from '../../shared/types';

import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentAvo,
	GetNavigationElementsDocument as GetNavigationElementsDocumentAvo,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentAvo,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentAvo,
	InsertNavigationItemDocument as InsertNavigationItemDocumentAvo,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentAvo,
} from '~generated/graphql-db-types-avo';
// import {
// 	GetIdpsDocument as GetIdpsDocumentHetArchief,
// 	GetProfileIdsDocument as GetProfileIdsDocumentHetArchief,
// 	GetProfileNamesDocument as GetProfileNamesDocumentHetArchief,
// 	GetUsersDocument as GetUsersDocumentHetArchief,
// } from '~generated/graphql-db-types-hetarchief';

type NavigationQueries = {
	DeleteNavigationItemDocument: string;
	GetNavigationElementsDocument: string;
	GetNavigationItemByIdDocument: string;
	GetNavigationItemsByPlacementDocument: string;
	InsertNavigationItemDocument: string;
	UpdateNavigationItemByIdDocument: string;
};

export const NAVIGATION_QUERIES: Record<AvoOrHetArchief, NavigationQueries> = {
	[AvoOrHetArchief.avo]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentAvo,
		GetNavigationElementsDocument: GetNavigationElementsDocumentAvo,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentAvo,
		GetNavigationItemsByPlacementDocument: GetNavigationItemsByPlacementDocumentAvo,
		InsertNavigationItemDocument: InsertNavigationItemDocumentAvo,
		UpdateNavigationItemByIdDocument: UpdateNavigationItemByIdDocumentAvo,
	},
	// TODO replace with archief queries
	[AvoOrHetArchief.hetArchief]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentAvo,
		GetNavigationElementsDocument: GetNavigationElementsDocumentAvo,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentAvo,
		GetNavigationItemsByPlacementDocument: GetNavigationItemsByPlacementDocumentAvo,
		InsertNavigationItemDocument: InsertNavigationItemDocumentAvo,
		UpdateNavigationItemByIdDocument: UpdateNavigationItemByIdDocumentAvo,
	},
};
