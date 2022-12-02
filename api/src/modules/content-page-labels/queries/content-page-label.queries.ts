import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { AvoOrHetArchief } from '../../shared/types';
import {
	DeleteContentPageLabelByIdDocument as DeleteContentPageLabelByIdDocumentAvo,
	DeleteContentPageLabelByIdMutation as DeleteContentPageLabelByIdMutationAvo,
	DeleteContentPageLabelByIdMutationVariables as DeleteContentPageLabelByIdMutationVariablesAvo,
	GetContentPageLabelByIdDocument as GetContentPageLabelByIdDocumentAvo,
	GetContentPageLabelByIdQuery as GetContentPageLabelByIdQueryAvo,
	GetContentPageLabelByIdQueryVariables as GetContentPageLabelByIdQueryVariablesAvo,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentAvo,
	GetContentPageLabelsByTypeAndIdsQuery as GetContentPageLabelsByTypeAndIdsQueryAvo,
	GetContentPageLabelsByTypeAndIdsQueryVariables as GetContentPageLabelsByTypeAndIdsQueryVariablesAvo,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentAvo,
	GetContentPageLabelsByTypeAndLabelsQuery as GetContentPageLabelsByTypeAndLabelsQueryAvo,
	GetContentPageLabelsByTypeAndLabelsQueryVariables as GetContentPageLabelsByTypeAndLabelsQueryVariablesAvo,
	GetContentPageLabelsDocument as GetContentPageLabelsDocumentAvo,
	GetContentPageLabelsQuery as GetContentPageLabelsQueryAvo,
	GetContentPageLabelsQueryVariables as GetContentPageLabelsQueryVariablesAvo,
	InsertContentPageLabelDocument as InsertContentPageLabelDocumentAvo,
	InsertContentPageLabelMutation as InsertContentPageLabelMutationAvo,
	InsertContentPageLabelMutationVariables as InsertContentPageLabelMutationVariablesAvo,
	UpdateContentPageLabelDocument as UpdateContentPageLabelDocumentAvo,
	UpdateContentPageLabelMutation as UpdateContentPageLabelMutationAvo,
	UpdateContentPageLabelMutationVariables as UpdateContentPageLabelMutationVariablesAvo,
} from '../../shared/generated/graphql-db-types-avo';
import {
	DeleteContentPageLabelByIdDocument as DeleteContentPageLabelByIdDocumentHetArchief,
	DeleteContentPageLabelByIdMutation as DeleteContentPageLabelByIdMutationHetArchief,
	DeleteContentPageLabelByIdMutationVariables as DeleteContentPageLabelByIdMutationVariablesHetArchief,
	GetContentPageLabelByIdDocument as GetContentPageLabelByIdDocumentHetArchief,
	GetContentPageLabelByIdQuery as GetContentPageLabelByIdQueryHetArchief,
	GetContentPageLabelByIdQueryVariables as GetContentPageLabelByIdQueryVariablesHetArchief,
	GetContentPageLabelsByTypeAndIdsDocument as GetContentPageLabelsByTypeAndIdsDocumentHetArchief,
	GetContentPageLabelsByTypeAndIdsQuery as GetContentPageLabelsByTypeAndIdsQueryHetArchief,
	GetContentPageLabelsByTypeAndIdsQueryVariables as GetContentPageLabelsByTypeAndIdsQueryVariablesHetArchief,
	GetContentPageLabelsByTypeAndLabelsDocument as GetContentPageLabelsByTypeAndLabelsDocumentHetArchief,
	GetContentPageLabelsByTypeAndLabelsQuery as GetContentPageLabelsByTypeAndLabelsQueryHetArchief,
	GetContentPageLabelsByTypeAndLabelsQueryVariables as GetContentPageLabelsByTypeAndLabelsQueryVariablesHetArchief,
	GetContentPageLabelsDocument as GetContentPageLabelsDocumentHetArchief,
	GetContentPageLabelsQuery as GetContentPageLabelsQueryHetArchief,
	GetContentPageLabelsQueryVariables as GetContentPageLabelsQueryVariablesHetArchief,
	InsertContentPageLabelDocument as InsertContentPageLabelDocumentHetArchief,
	InsertContentPageLabelMutation as InsertContentPageLabelMutationHetArchief,
	InsertContentPageLabelMutationVariables as InsertContentPageLabelMutationVariablesHetArchief,
	UpdateContentPageLabelDocument as UpdateContentPageLabelDocumentHetArchief,
	UpdateContentPageLabelMutation as UpdateContentPageLabelMutationHetArchief,
	UpdateContentPageLabelMutationVariables as UpdateContentPageLabelMutationVariablesHetArchief,
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
	GetContentPageLabelsQuery:
		| GetContentPageLabelsQueryAvo
		| GetContentPageLabelsQueryHetArchief;
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
	DeleteContentPageLabelByIdDocument: TypedDocumentNode;
	GetContentPageLabelByIdDocument: TypedDocumentNode;
	GetContentPageLabelsDocument: TypedDocumentNode;
	InsertContentPageLabelDocument: TypedDocumentNode;
	UpdateContentPageLabelDocument: TypedDocumentNode;
	GetContentPageLabelsByTypeAndIdsDocument: TypedDocumentNode;
	GetContentPageLabelsByTypeAndLabelsDocument: TypedDocumentNode;
};

export const CONTENT_PAGE_LABEL_QUERIES: Record<
	AvoOrHetArchief,
	ContentPageLabelQueries
> = {
	[AvoOrHetArchief.avo]: {
		DeleteContentPageLabelByIdDocument: DeleteContentPageLabelByIdDocumentAvo,
		GetContentPageLabelByIdDocument: GetContentPageLabelByIdDocumentAvo,
		GetContentPageLabelsDocument: GetContentPageLabelsDocumentAvo,
		InsertContentPageLabelDocument: InsertContentPageLabelDocumentAvo,
		UpdateContentPageLabelDocument: UpdateContentPageLabelDocumentAvo,
		GetContentPageLabelsByTypeAndIdsDocument:
			GetContentPageLabelsByTypeAndIdsDocumentAvo,
		GetContentPageLabelsByTypeAndLabelsDocument:
			GetContentPageLabelsByTypeAndLabelsDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		DeleteContentPageLabelByIdDocument:
			DeleteContentPageLabelByIdDocumentHetArchief,
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
