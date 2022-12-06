import { GetOrganisationDocument as GetOrganisationDocumentAvo } from '../shared/generated/graphql-db-types-avo';
import { GetOrganisationDocument as GetOrganisationDocumentHetArchief } from '../shared/generated/graphql-db-types-hetarchief';
import { DatabaseType } from '@viaa/avo2-types';
import { OrganisationQueries } from './admin-organisations.types';

export const ORGANISATION_QUERIES: Record<DatabaseType, OrganisationQueries> = {
	[DatabaseType.avo]: {
		GetOrganisationDocument: GetOrganisationDocumentAvo,
	},
	[DatabaseType.hetArchief]: {
		GetOrganisationDocument: GetOrganisationDocumentHetArchief,
	},
};
