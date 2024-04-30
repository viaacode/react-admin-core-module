import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { DatabaseType } from '@viaa/avo2-types';

import {
	GetSiteVariableByNameDocument as GetSiteVariableByNameDocumentAvo,
	type GetSiteVariableByNameQuery as GetSiteVariableByNameQueryAvo,
	type GetSiteVariableByNameQueryVariables as GetSiteVariableByNameQueryVariablesAvo,
	UpdateSiteVariableByNameDocument as UpdateSiteVariableByNameDocumentAvo,
	type UpdateSiteVariableByNameMutation as UpdateSiteVariableByNameMutationAvo,
	type UpdateSiteVariableByNameMutationVariables as UpdateSiteVariableByNameMutationVariablesAvo,
} from '../shared/generated/graphql-db-types-avo';
import {
	GetSiteVariableByNameDocument as GetSiteVariableByNameDocumentHetArchief,
	type GetSiteVariableByNameQuery as GetSiteVariableByNameQueryHetArchief,
	type GetSiteVariableByNameQueryVariables as GetSiteVariableByNameQueryVariablesHetArchief,
	UpdateSiteVariableByNameDocument as UpdateSiteVariableByNameDocumentHetArchief,
	type UpdateSiteVariableByNameMutation as UpdateSiteVariableByNameMutationHetArchief,
	type UpdateSiteVariableByNameMutationVariables as UpdateSiteVariableByNameMutationVariablesHetArchief,
} from '../shared/generated/graphql-db-types-hetarchief';

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
	GetSiteVariableByNameDocument: TypedDocumentNode<any, any>;
	UpdateSiteVariableByNameDocument: TypedDocumentNode<any, any>;
};

export const SITE_VARIABLE_QUERIES: Record<DatabaseType, SiteVariableQueries> = {
	[DatabaseType.avo]: {
		GetSiteVariableByNameDocument: GetSiteVariableByNameDocumentAvo,
		UpdateSiteVariableByNameDocument: UpdateSiteVariableByNameDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetSiteVariableByNameDocument: GetSiteVariableByNameDocumentHetArchief,
		UpdateSiteVariableByNameDocument: UpdateSiteVariableByNameDocumentHetArchief,
	},
};
