import { AvoOrHetArchief } from '../content-pages';
import {
	GetSiteVariableByNameDocument as GetSiteVariableByNameDocumentAvo,
	GetSiteVariableByNameQuery as GetSiteVariableByNameQueryAvo,
	GetSiteVariableByNameQueryVariables as GetSiteVariableByNameQueryVariablesAvo,
	UpdateSiteVariableByNameDocument as UpdateSiteVariableByNameDocumentAvo,
	UpdateSiteVariableByNameMutation as UpdateSiteVariableByNameMutationAvo,
	UpdateSiteVariableByNameMutationVariables as UpdateSiteVariableByNameMutationVariablesAvo,
} from '../shared/generated/graphql-db-types-avo';
import {
	GetSiteVariableByNameDocument as GetSiteVariableByNameDocumentHetArchief,
	GetSiteVariableByNameQuery as GetSiteVariableByNameQueryHetArchief,
	GetSiteVariableByNameQueryVariables as GetSiteVariableByNameQueryVariablesHetArchief,
	UpdateSiteVariableByNameDocument as UpdateSiteVariableByNameDocumentHetArchief,
	UpdateSiteVariableByNameMutation as UpdateSiteVariableByNameMutationHetArchief,
	UpdateSiteVariableByNameMutationVariables as UpdateSiteVariableByNameMutationVariablesHetArchief,
} from '../shared/generated/graphql-db-types-hetarchief';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export type SiteVariableQueryTypes = {
	GetSiteVariableByNameQueryAvo: GetSiteVariableByNameQueryAvo;
	GetSiteVariableByNameQueryHetArchief: GetSiteVariableByNameQueryHetArchief;
	GetSiteVariableByNameQuery:
		| GetSiteVariableByNameQueryAvo
		| GetSiteVariableByNameQueryHetArchief;

	GetSiteVariableByNameQueryVariablesAvo: GetSiteVariableByNameQueryVariablesAvo;
	GetSiteVariableByNameQueryVariablesHetArchief: GetSiteVariableByNameQueryVariablesHetArchief;
	GetSiteVariableByNameQueryVariables:
		| GetSiteVariableByNameQueryVariablesAvo
		| GetSiteVariableByNameQueryVariablesHetArchief;

	UpdateSiteVariableByNameMutationAvo: UpdateSiteVariableByNameMutationAvo;
	UpdateSiteVariableByNameMutationHetArchief: UpdateSiteVariableByNameMutationHetArchief;
	UpdateSiteVariableByNameMutation:
		| UpdateSiteVariableByNameMutationAvo
		| UpdateSiteVariableByNameMutationHetArchief;

	UpdateSiteVariableByNameMutationVariablesAvo: UpdateSiteVariableByNameMutationVariablesAvo;
	UpdateSiteVariableByNameMutationVariablesHetArchief: UpdateSiteVariableByNameMutationVariablesHetArchief;
	UpdateSiteVariableByNameMutationVariables:
		| UpdateSiteVariableByNameMutationVariablesAvo
		| UpdateSiteVariableByNameMutationVariablesHetArchief;
};

type SiteVariableQueries = {
	GetSiteVariableByNameDocument: TypedDocumentNode;
	UpdateSiteVariableByNameDocument: TypedDocumentNode;
};

export const SITE_VARIABLE_QUERIES: Record<
	AvoOrHetArchief,
	SiteVariableQueries
> = {
	[AvoOrHetArchief.avo]: {
		GetSiteVariableByNameDocument: GetSiteVariableByNameDocumentAvo,
		UpdateSiteVariableByNameDocument: UpdateSiteVariableByNameDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetSiteVariableByNameDocument: GetSiteVariableByNameDocumentHetArchief,
		UpdateSiteVariableByNameDocument:
			UpdateSiteVariableByNameDocumentHetArchief,
	},
};
