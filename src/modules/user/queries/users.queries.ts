import { AvoOrHetArchief } from '../../shared/types';

import {
	GetIdpsDocument as GetIdpsDocumentAvo,
	GetProfileIdsDocument as GetProfileIdsDocumentAvo,
	GetProfileNamesDocument as GetProfileNamesDocumentAvo,
	GetUsersDocument as GetUsersDocumentAvo,
} from '~generated/graphql-db-types-avo';
import {
	GetIdpsDocument as GetIdpsDocumentHetArchief,
	GetProfileIdsDocument as GetProfileIdsDocumentHetArchief,
	GetProfileNamesDocument as GetProfileNamesDocumentHetArchief,
	GetUsersDocument as GetUsersDocumentHetArchief,
} from '~generated/graphql-db-types-hetarchief';

type ContentPageQueries = {
	GetProfileNamesDocument: string;
	GetUsersDocument: string;
	GetIdpsDocument: string;
	GetProfileIds: string;
};

export const USER_QUERIES: Record<AvoOrHetArchief, ContentPageQueries> = {
	[AvoOrHetArchief.avo]: {
		GetProfileNamesDocument: GetProfileNamesDocumentAvo,
		GetUsersDocument: GetUsersDocumentAvo,
		GetIdpsDocument: GetIdpsDocumentAvo,
		GetProfileIds: GetProfileIdsDocumentAvo
	},
	[AvoOrHetArchief.hetArchief]: {
		GetProfileNamesDocument: GetProfileNamesDocumentHetArchief,
		GetUsersDocument: GetUsersDocumentHetArchief,
		GetIdpsDocument: GetIdpsDocumentHetArchief,
		GetProfileIds: GetProfileIdsDocumentHetArchief
	},
};
