import { GetOrganisationDocument as GetOrganisationDocumentAvo } from '../shared/generated/graphql-db-types-avo';
import { GetOrganisationDocument as GetOrganisationDocumentHetArchief } from '../shared/generated/graphql-db-types-hetarchief';
import { AvoOrHetArchief } from '../content-pages/content-pages.types';
import { OrganisationQueries } from './admin-organisations.types';

export const ORGANISATION_QUERIES: Record<
	AvoOrHetArchief,
	OrganisationQueries
> = {
	[AvoOrHetArchief.avo]: {
		GetOrganisationDocument: GetOrganisationDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetOrganisationDocument: GetOrganisationDocumentHetArchief,
	},
};
