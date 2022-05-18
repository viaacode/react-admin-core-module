import { AvoOrHetArchief } from '../../shared/types';

import {
	GetTranslationsDocument as GetTranslationsDocumentAvo,
	UpdateTranslationsDocument as UpdateTranslationsDocumentAvo
} from '~generated/graphql-db-types-avo';

import {
	GetTranslationsDocument as GetTranslationsDocumentHetArchief,
	UpdateTranslationsDocument as UpdateTranslationsDocumentHetArchief
} from '~generated/graphql-db-types-hetarchief';

type TranslationQueries = {
	GetTranslationsDocument: string;
	UpdateTranslationsDocument: string;
};

export const TRANSLATIONS_QUERIES: Record<AvoOrHetArchief, TranslationQueries> = {
	[AvoOrHetArchief.avo]: {
		GetTranslationsDocument: GetTranslationsDocumentAvo,
		UpdateTranslationsDocument: UpdateTranslationsDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetTranslationsDocument: GetTranslationsDocumentHetArchief,
		UpdateTranslationsDocument: UpdateTranslationsDocumentHetArchief,
	},
};
