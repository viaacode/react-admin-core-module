import { AvoOrHetArchief } from '../../shared/types';

import {
	DeleteContentPageLabelByIdDocument as DeleteContentPageLabelByIdDocumentAvo,
	GetContentPageLabelByIdDocument as GetContentPageLabelByIdDocumentAvo,
	GetContentPageLabelsDocument as GetContentPageLabelsDocumentAvo,
	InsertContentPageLabelDocument as InsertContentPageLabelDocumentAvo,
	UpdateContentPageLabelDocument as UpdateContentPageLabelDocumentAvo,
} from 'generated/graphql-db-types-avo';
import {
	DeleteContentPageLabelByIdDocument as DeleteContentPageLabelByIdDocumentHetArchief,
	GetContentPageLabelByIdDocument as GetContentPageLabelByIdDocumentHetArchief,
	GetContentPageLabelsDocument as GetContentPageLabelsDocumentHetArchief,
	InsertContentPageLabelDocument as InsertContentPageLabelDocumentHetArchief,
	UpdateContentPageLabelDocument as UpdateContentPageLabelDocumentHetArchief,
} from 'generated/graphql-db-types-hetarchief';

type ContentPageLabelQueries = {
	GetContentPageLabelsDocument: string;
	DeleteContentPageLabelByIdDocument: string;
	UpdateContentPageLabelDocument: string;
	InsertContentPageLabelDocument: string;
	GetContentPageLabelByIdDocument: string;
};

export const CONTENT_PAGE_LABEL_QUERIES: Record<AvoOrHetArchief, ContentPageLabelQueries> = {
	[AvoOrHetArchief.avo]: {
		GetContentPageLabelsDocument: GetContentPageLabelsDocumentAvo,
		DeleteContentPageLabelByIdDocument: DeleteContentPageLabelByIdDocumentAvo,
		UpdateContentPageLabelDocument: UpdateContentPageLabelDocumentAvo,
		InsertContentPageLabelDocument: InsertContentPageLabelDocumentAvo,
		GetContentPageLabelByIdDocument: GetContentPageLabelByIdDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetContentPageLabelsDocument: GetContentPageLabelsDocumentHetArchief,
		DeleteContentPageLabelByIdDocument: DeleteContentPageLabelByIdDocumentHetArchief,
		UpdateContentPageLabelDocument: UpdateContentPageLabelDocumentHetArchief,
		InsertContentPageLabelDocument: InsertContentPageLabelDocumentHetArchief,
		GetContentPageLabelByIdDocument: GetContentPageLabelByIdDocumentHetArchief,
	},
};
