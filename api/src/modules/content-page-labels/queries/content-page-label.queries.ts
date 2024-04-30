import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';

import {
	DeleteContentPageLabelByIdDocument as DeleteContentPageLabelByIdDocumentAvo,
	type DeleteContentPageLabelByIdMutation as DeleteContentPageLabelByIdMutationAvo,
	type DeleteContentPageLabelByIdMutationVariables as DeleteContentPageLabelByIdMutationVariablesAvo,
	GetContentPageLabelByIdDocument as GetContentPageLabelByIdDocumentAvo,
	type GetContentPageLabelByIdQuery as GetContentPageLabelByIdQueryAvo,
	type GetContentPageLabelByIdQueryVariables as GetContentPageLabelByIdQueryVariablesAvo,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentAvo,
	type GetContentPageLabelsByTypeAndIdsQuery as GetContentPageLabelsByTypeAndIdsQueryAvo,
	type GetContentPageLabelsByTypeAndIdsQueryVariables as GetContentPageLabelsByTypeAndIdsQueryVariablesAvo,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentAvo,
	type GetContentPageLabelsByTypeAndLabelsQuery as GetContentPageLabelsByTypeAndLabelsQueryAvo,
	type GetContentPageLabelsByTypeAndLabelsQueryVariables as GetContentPageLabelsByTypeAndLabelsQueryVariablesAvo,
	GetContentPageLabelsDocument as GetContentPageLabelsDocumentAvo,
	type GetContentPageLabelsQuery as GetContentPageLabelsQueryAvo,
	type GetContentPageLabelsQueryVariables as GetContentPageLabelsQueryVariablesAvo,
	InsertContentPageLabelDocument as InsertContentPageLabelDocumentAvo,
	type InsertContentPageLabelMutation as InsertContentPageLabelMutationAvo,
	type InsertContentPageLabelMutationVariables as InsertContentPageLabelMutationVariablesAvo,
	UpdateContentPageLabelDocument as UpdateContentPageLabelDocumentAvo,
	type UpdateContentPageLabelMutation as UpdateContentPageLabelMutationAvo,
	type UpdateContentPageLabelMutationVariables as UpdateContentPageLabelMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	DeleteContentPageLabelByIdDocument as DeleteContentPageLabelByIdDocumentHetArchief,
	type DeleteContentPageLabelByIdMutation as DeleteContentPageLabelByIdMutationHetArchief,
	type DeleteContentPageLabelByIdMutationVariables as DeleteContentPageLabelByIdMutationVariablesHetArchief,
	GetContentPageLabelByIdDocument as GetContentPageLabelByIdDocumentHetArchief,
	type GetContentPageLabelByIdQuery as GetContentPageLabelByIdQueryHetArchief,
	type GetContentPageLabelByIdQueryVariables as GetContentPageLabelByIdQueryVariablesHetArchief,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
	type GetContentPageLabelsByTypeAndIdsQuery as GetContentPageLabelsByTypeAndIdsQueryHetArchief,
	type GetContentPageLabelsByTypeAndIdsQueryVariables as GetContentPageLabelsByTypeAndIdsQueryVariablesHetArchief,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
	type GetContentPageLabelsByTypeAndLabelsQuery as GetContentPageLabelsByTypeAndLabelsQueryHetArchief,
	type GetContentPageLabelsByTypeAndLabelsQueryVariables as GetContentPageLabelsByTypeAndLabelsQueryVariablesHetArchief,
	GetContentPageLabelsDocument as GetContentPageLabelsDocumentHetArchief,
	type GetContentPageLabelsQuery as GetContentPageLabelsQueryHetArchief,
	type GetContentPageLabelsQueryVariables as GetContentPageLabelsQueryVariablesHetArchief,
	InsertContentPageLabelDocument as InsertContentPageLabelDocumentHetArchief,
	type InsertContentPageLabelMutation as InsertContentPageLabelMutationHetArchief,
	type InsertContentPageLabelMutationVariables as InsertContentPageLabelMutationVariablesHetArchief,
	UpdateContentPageLabelDocument as UpdateContentPageLabelDocumentHetArchief,
	type UpdateContentPageLabelMutation as UpdateContentPageLabelMutationHetArchief,
	type UpdateContentPageLabelMutationVariables as UpdateContentPageLabelMutationVariablesHetArchief,
} from '../../shared/generated/graphql-db-types-hetarchief';

export type ContentPageLabelQueryTypes = {
	DeleteContentPageLabelByIdMutationAvo: DeleteContentPageLabelByIdMutationAvo;
	DeleteContentPageLabelByIdMutationHetArchief: DeleteContentPageLabelByIdMutationHetArchief;
	DeleteContentPageLabelByIdMutation:
		| DeleteContentPageLabelByIdMutationAvo
		| DeleteContentPageLabelByIdMutationHetArchief;
	GetContentPageLabelByIdQueryAvo: GetContentPageLabelByIdQueryAvo;
	GetContentPageLabelByIdQueryHetArchief: GetContentPageLabelByIdQueryHetArchief;
	GetContentPageLabelByIdQuery:
		| GetContentPageLabelByIdQueryAvo
		| GetContentPageLabelByIdQueryHetArchief;
	GetContentPageLabelsQueryAvo: GetContentPageLabelsQueryAvo;
	GetContentPageLabelsQueryHetArchief: GetContentPageLabelsQueryHetArchief;
	GetContentPageLabelsQuery: GetContentPageLabelsQueryAvo | GetContentPageLabelsQueryHetArchief;
	InsertContentPageLabelMutationAvo: InsertContentPageLabelMutationAvo;
	InsertContentPageLabelMutationHetArchief: InsertContentPageLabelMutationHetArchief;
	InsertContentPageLabelMutation:
		| InsertContentPageLabelMutationAvo
		| InsertContentPageLabelMutationHetArchief;
	UpdateContentPageLabelMutationAvo: UpdateContentPageLabelMutationAvo;
	UpdateContentPageLabelMutationHetArchief: UpdateContentPageLabelMutationHetArchief;
	UpdateContentPageLabelMutation:
		| UpdateContentPageLabelMutationAvo
		| UpdateContentPageLabelMutationHetArchief;
	DeleteContentPageLabelByIdMutationVariablesAvo: DeleteContentPageLabelByIdMutationVariablesAvo;
	DeleteContentPageLabelByIdMutationVariablesHetArchief: DeleteContentPageLabelByIdMutationVariablesHetArchief;
	DeleteContentPageLabelByIdMutationVariables:
		| DeleteContentPageLabelByIdMutationVariablesAvo
		| DeleteContentPageLabelByIdMutationVariablesHetArchief;
	GetContentPageLabelByIdQueryVariablesAvo: GetContentPageLabelByIdQueryVariablesAvo;
	GetContentPageLabelByIdQueryVariablesHetArchief: GetContentPageLabelByIdQueryVariablesHetArchief;
	GetContentPageLabelByIdQueryVariables:
		| GetContentPageLabelByIdQueryVariablesAvo
		| GetContentPageLabelByIdQueryVariablesHetArchief;
	GetContentPageLabelsQueryVariablesAvo: GetContentPageLabelsQueryVariablesAvo;
	GetContentPageLabelsQueryVariablesHetArchief: GetContentPageLabelsQueryVariablesHetArchief;
	GetContentPageLabelsQueryVariables:
		| GetContentPageLabelsQueryVariablesAvo
		| GetContentPageLabelsQueryVariablesHetArchief;
	InsertContentPageLabelMutationVariablesAvo: InsertContentPageLabelMutationVariablesAvo;
	InsertContentPageLabelMutationVariablesHetArchief: InsertContentPageLabelMutationVariablesHetArchief;
	InsertContentPageLabelMutationVariables:
		| InsertContentPageLabelMutationVariablesAvo
		| InsertContentPageLabelMutationVariablesHetArchief;
	UpdateContentPageLabelMutationVariablesAvo: UpdateContentPageLabelMutationVariablesAvo;
	UpdateContentPageLabelMutationVariablesHetArchief: UpdateContentPageLabelMutationVariablesHetArchief;
	UpdateContentPageLabelMutationVariables:
		| UpdateContentPageLabelMutationVariablesAvo
		| UpdateContentPageLabelMutationVariablesHetArchief;
	GetContentPageLabelsByTypeAndIdsQueryAvo: GetContentPageLabelsByTypeAndIdsQueryAvo;
	GetContentPageLabelsByTypeAndIdsQueryHetArchief: GetContentPageLabelsByTypeAndIdsQueryHetArchief;
	GetContentPageLabelsByTypeAndIdsQuery:
		| GetContentPageLabelsByTypeAndIdsQueryAvo
		| GetContentPageLabelsByTypeAndIdsQueryHetArchief;
	GetContentPageLabelsByTypeAndLabelsQueryAvo: GetContentPageLabelsByTypeAndLabelsQueryAvo;
	GetContentPageLabelsByTypeAndLabelsQueryHetArchief: GetContentPageLabelsByTypeAndLabelsQueryHetArchief;
	GetContentPageLabelsByTypeAndLabelsQuery:
		| GetContentPageLabelsByTypeAndLabelsQueryAvo
		| GetContentPageLabelsByTypeAndLabelsQueryHetArchief;
	GetContentPageLabelsByTypeAndIdsQueryVariablesAvo: GetContentPageLabelsByTypeAndIdsQueryVariablesAvo;
	GetContentPageLabelsByTypeAndIdsQueryVariablesHetArchief: GetContentPageLabelsByTypeAndIdsQueryVariablesHetArchief;
	GetContentPageLabelsByTypeAndIdsQueryVariables:
		| GetContentPageLabelsByTypeAndIdsQueryVariablesAvo
		| GetContentPageLabelsByTypeAndIdsQueryVariablesHetArchief;
	GetContentPageLabelsByTypeAndLabelsQueryVariablesAvo: GetContentPageLabelsByTypeAndLabelsQueryVariablesAvo;
	GetContentPageLabelsByTypeAndLabelsQueryVariablesHetArchief: GetContentPageLabelsByTypeAndLabelsQueryVariablesHetArchief;
	GetContentPageLabelsByTypeAndLabelsQueryVariables:
		| GetContentPageLabelsByTypeAndLabelsQueryVariablesAvo
		| GetContentPageLabelsByTypeAndLabelsQueryVariablesHetArchief;
};

type ContentPageLabelQueries = {
	DeleteContentPageLabelByIdDocument: TypedDocumentNode<any, any>;
	GetContentPageLabelByIdDocument: TypedDocumentNode<any, any>;
	GetContentPageLabelsDocument: TypedDocumentNode<any, any>;
	InsertContentPageLabelDocument: TypedDocumentNode<any, any>;
	UpdateContentPageLabelDocument: TypedDocumentNode<any, any>;
	GetContentPageLabelsByTypeAndIdsDocument: TypedDocumentNode<any, any>;
	GetContentPageLabelsByTypeAndLabelsDocument: TypedDocumentNode<any, any>;
};

export const CONTENT_PAGE_LABEL_QUERIES: Record<DatabaseType, ContentPageLabelQueries> = {
	[DatabaseType.avo]: {
		DeleteContentPageLabelByIdDocument: DeleteContentPageLabelByIdDocumentAvo,
		GetContentPageLabelByIdDocument: GetContentPageLabelByIdDocumentAvo,
		GetContentPageLabelsDocument: GetContentPageLabelsDocumentAvo,
		InsertContentPageLabelDocument: InsertContentPageLabelDocumentAvo,
		UpdateContentPageLabelDocument: UpdateContentPageLabelDocumentAvo,
		GetContentPageLabelsByTypeAndIdsDocument: GetContentPageLabelsByTypeAndIdsDocumentAvo,
		GetContentPageLabelsByTypeAndLabelsDocument: GetContentPageLabelsByTypeAndLabelsDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		DeleteContentPageLabelByIdDocument: DeleteContentPageLabelByIdDocumentHetArchief,
		GetContentPageLabelByIdDocument: GetContentPageLabelByIdDocumentHetArchief,
		GetContentPageLabelsDocument: GetContentPageLabelsDocumentHetArchief,
		InsertContentPageLabelDocument: InsertContentPageLabelDocumentHetArchief,
		UpdateContentPageLabelDocument: UpdateContentPageLabelDocumentHetArchief,
		GetContentPageLabelsByTypeAndIdsDocument:
			GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
		GetContentPageLabelsByTypeAndLabelsDocument:
			GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
	},
};
