import { AvoOrHetArchief } from '../../shared/types';

import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentAvo,
	GetNavigationElementsDocument as GetNavigationElementsDocumentAvo,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentAvo,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentAvo,
	InsertNavigationItemDocument as InsertNavigationItemDocumentAvo,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentAvo,
} from '~generated/graphql-db-types-avo';
import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentHetArchief,
	GetNavigationElementsDocument as GetNavigationElementsDocumentHetArchief,
	GetNavigationItemByIdDocument as GetNavigationItemByIdDocumentHetArchief,
	GetNavigationItemsByPlacementDocument as GetNavigationItemsByPlacementDocumentHetArchief,
	InsertNavigationItemDocument as InsertNavigationItemDocumentHetArchief,
	UpdateNavigationItemByIdDocument as UpdateNavigationItemByIdDocumentHetArchief,
} from '~generated/graphql-db-types-avo';

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
	[AvoOrHetArchief.hetArchief]: {
		DeleteNavigationItemDocument: DeleteNavigationItemDocumentHetArchief,
		GetNavigationElementsDocument: GetNavigationElementsDocumentHetArchief,
		GetNavigationItemByIdDocument: GetNavigationItemByIdDocumentHetArchief,
		GetNavigationItemsByPlacementDocument: GetNavigationItemsByPlacementDocumentHetArchief,
		InsertNavigationItemDocument: InsertNavigationItemDocumentHetArchief,
		UpdateNavigationItemByIdDocument: UpdateNavigationItemByIdDocumentHetArchief,
	},
};
