import { AvoOrHetArchief } from '../../shared/types';

import {
	GetTranslationsDocument as GetTranslationsDocumentAvo,
	GetTranslationsQuery as GetTranslationsQueryAvo,
	GetTranslationsQueryVariables as GetTranslationsQueryVariablesAvo,
	UpdateTranslationsDocument as UpdateTranslationsDocumentAvo,
	UpdateTranslationsMutation as UpdateTranslationsMutationAvo,
	UpdateTranslationsMutationVariables as UpdateTranslationsMutationVariablesAvo,
} from '~generated/graphql-db-types-avo';

import {
	GetTranslationsDocument as GetTranslationsDocumentHetArchief,
	GetTranslationsQuery as GetTranslationsQueryHetArchief,
	GetTranslationsQueryVariables as GetTranslationsQueryVariablesHetArchief,
	UpdateTranslationsDocument as UpdateTranslationsDocumentHetArchief,
	UpdateTranslationsMutation as UpdateTranslationsMutationHetArchief,
	UpdateTranslationsMutationVariables as UpdateTranslationsMutationVariablesHetArchief,
} from '~generated/graphql-db-types-hetarchief';

export type TranslationQueryTypes = {
	GetTranslationsQueryAvo: GetTranslationsQueryAvo;
	GetTranslationsQueryHetArchief: GetTranslationsQueryHetArchief;
	GetTranslationsQuery: GetTranslationsQueryAvo | GetTranslationsQueryHetArchief;
	UpdateTranslationsMutationAvo: UpdateTranslationsMutationAvo;
	UpdateTranslationsMutationHetArchief: UpdateTranslationsMutationHetArchief;
	UpdateTranslationsMutation:
		| UpdateTranslationsMutationAvo
		| UpdateTranslationsMutationHetArchief;
	GetTranslationsQueryVariablesAvo: GetTranslationsQueryVariablesAvo;
	GetTranslationsQueryVariablesHetArchief: GetTranslationsQueryVariablesHetArchief;
	GetTranslationsQueryVariables:
		| GetTranslationsQueryVariablesAvo
		| GetTranslationsQueryVariablesHetArchief;
	UpdateTranslationsMutationVariablesAvo: UpdateTranslationsMutationVariablesAvo;
	UpdateTranslationsMutationVariablesHetArchief: UpdateTranslationsMutationVariablesHetArchief;
	UpdateTranslationsMutationVariables:
		| UpdateTranslationsMutationVariablesAvo
		| UpdateTranslationsMutationVariablesHetArchief;
};

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
