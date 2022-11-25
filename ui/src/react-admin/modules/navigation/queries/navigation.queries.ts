import { AvoOrHetArchief } from '../../shared/types';

import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentAvo,
	DeleteNavigationItemMutation as DeleteNavigationItemMutationAvo,
	DeleteNavigationItemMutationVariables as DeleteNavigationItemMutationVariablesAvo,
	GetNavigationElementsDocument as GetNavigationElementsDocumentAvo,
	GetNavigationElementsQuery as GetNavigationElementsQueryAvo,
	GetNavigationElementsQueryVariables as GetNavigationElementsQueryVariablesAvo,
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
} from '~generated/graphql-db-types-avo';
import {
	DeleteNavigationItemDocument as DeleteNavigationItemDocumentHetArchief,
	DeleteNavigationItemMutation as DeleteNavigationItemMutationHetArchief,
	DeleteNavigationItemMutationVariables as DeleteNavigationItemMutationVariablesHetArchief,
	GetNavigationElementsDocument as GetNavigationElementsDocumentHetArchief,
	GetNavigationElementsQuery as GetNavigationElementsQueryHetArchief,
	GetNavigationElementsQueryVariables as GetNavigationElementsQueryVariablesHetArchief,
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
} from '~generated/graphql-db-types-hetarchief';

export type NavigationQueryTypes = {
	GetNavigationElementsQueryAvo: GetNavigationElementsQueryAvo;
	GetNavigationElementsQueryHetArchief: GetNavigationElementsQueryHetArchief;
	GetNavigationElementsQuery:
		| GetNavigationElementsQueryAvo
		| GetNavigationElementsQueryHetArchief;
	GetNavigationItemByIdQueryAvo: GetNavigationItemByIdQueryAvo;
	GetNavigationItemByIdQueryHetArchief: GetNavigationItemByIdQueryHetArchief;
	GetNavigationItemByIdQuery:
		| GetNavigationItemByIdQueryAvo
		| GetNavigationItemByIdQueryHetArchief;
	GetNavigationItemsByPlacementQueryAvo: GetNavigationItemsByPlacementQueryAvo;
	GetNavigationItemsByPlacementQueryHetArchief: GetNavigationItemsByPlacementQueryHetArchief;
	GetNavigationItemsByPlacementQuery:
		| GetNavigationItemsByPlacementQueryAvo
		| GetNavigationItemsByPlacementQueryHetArchief;
	DeleteNavigationItemMutationAvo: DeleteNavigationItemMutationAvo;
	DeleteNavigationItemMutationHetArchief: DeleteNavigationItemMutationHetArchief;
	DeleteNavigationItemMutation:
		| DeleteNavigationItemMutationAvo
		| DeleteNavigationItemMutationHetArchief;
	InsertNavigationItemMutationAvo: InsertNavigationItemMutationAvo;
	InsertNavigationItemMutationHetArchief: InsertNavigationItemMutationHetArchief;
	InsertNavigationItemMutation:
		| InsertNavigationItemMutationAvo
		| InsertNavigationItemMutationHetArchief;
	UpdateNavigationItemByIdMutationAvo: UpdateNavigationItemByIdMutationAvo;
	UpdateNavigationItemByIdMutationHetArchief: UpdateNavigationItemByIdMutationHetArchief;
	UpdateNavigationItemByIdMutation:
		| UpdateNavigationItemByIdMutationAvo
		| UpdateNavigationItemByIdMutationHetArchief;

	GetNavigationElementsQueryVariablesAvo: GetNavigationElementsQueryVariablesAvo;
	GetNavigationElementsQueryVariablesHetArchief: GetNavigationElementsQueryVariablesHetArchief;
	GetNavigationElementsQueryVariables:
		| GetNavigationElementsQueryVariablesAvo
		| GetNavigationElementsQueryVariablesHetArchief;
	GetNavigationItemByIdQueryVariablesAvo: GetNavigationItemByIdQueryVariablesAvo;
	GetNavigationItemByIdQueryVariablesHetArchief: GetNavigationItemByIdQueryVariablesHetArchief;
	GetNavigationItemByIdQueryVariables:
		| GetNavigationItemByIdQueryVariablesAvo
		| GetNavigationItemByIdQueryVariablesHetArchief;
	GetNavigationItemsByPlacementQueryVariablesAvo: GetNavigationItemsByPlacementQueryVariablesAvo;
	GetNavigationItemsByPlacementQueryVariablesHetArchief: GetNavigationItemsByPlacementQueryVariablesHetArchief;
	GetNavigationItemsByPlacementQueryVariables:
		| GetNavigationItemsByPlacementQueryVariablesAvo
		| GetNavigationItemsByPlacementQueryVariablesHetArchief;
	DeleteNavigationItemMutationVariablesAvo: DeleteNavigationItemMutationVariablesAvo;
	DeleteNavigationItemMutationVariablesHetArchief: DeleteNavigationItemMutationVariablesHetArchief;
	DeleteNavigationItemMutationVariables:
		| DeleteNavigationItemMutationVariablesAvo
		| DeleteNavigationItemMutationVariablesHetArchief;
	InsertNavigationItemMutationVariablesAvo: InsertNavigationItemMutationVariablesAvo;
	InsertNavigationItemMutationVariablesHetArchief: InsertNavigationItemMutationVariablesHetArchief;
	InsertNavigationItemMutationVariables:
		| InsertNavigationItemMutationVariablesAvo
		| InsertNavigationItemMutationVariablesHetArchief;
	UpdateNavigationItemByIdMutationVariablesAvo: UpdateNavigationItemByIdMutationVariablesAvo;
	UpdateNavigationItemByIdMutationVariablesHetArchief: UpdateNavigationItemByIdMutationVariablesHetArchief;
	UpdateNavigationItemByIdMutationVariables:
		| UpdateNavigationItemByIdMutationVariablesAvo
		| UpdateNavigationItemByIdMutationVariablesHetArchief;
};

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