import { AvoOrHetArchief } from '../../shared/types';

import {
	GetProfileNamesDocument as GetProfileNamesDocumentAvo,
	GetUsersDocument as GetUsersDocumentAvo,
} from '~generated/graphql-db-types-avo';
import {
	GetProfileNamesDocument as GetProfileNamesDocumentHetArchief,
	GetUsersDocument as GetUsersDocumentHetArchief,
} from '~generated/graphql-db-types-hetarchief';

type ContentPageQueries = {
	GetProfileNamesDocument: string;
	GetUsersDocument: string;
};

export const USER_QUERIES: Record<AvoOrHetArchief, ContentPageQueries> = {
	[AvoOrHetArchief.avo]: {
		GetProfileNamesDocument: GetProfileNamesDocumentAvo,
		GetUsersDocument: GetUsersDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetProfileNamesDocument: GetProfileNamesDocumentHetArchief,
		GetUsersDocument: GetUsersDocumentHetArchief,
	},
};
