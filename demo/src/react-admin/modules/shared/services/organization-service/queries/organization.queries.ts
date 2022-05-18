import {
	GetOrganizationsWithUsersDocument as GetOrganizationsWithUsersDocumentAvo
} from '~generated/graphql-db-types-avo';

import {
	GetOrganizationsWithUsersDocument as GetOrganizationsWithUsersDocumentHetArchief
} from '~generated/graphql-db-types-hetarchief';

import { AvoOrHetArchief } from '~modules/shared/types';

type OrganizationQueries = {
	GetOrganizationsWithUsersDocument: string;
};

export const ORGANIZATION_QUERIES: Record<AvoOrHetArchief, OrganizationQueries> = {
	[AvoOrHetArchief.avo]: {
		GetOrganizationsWithUsersDocument: GetOrganizationsWithUsersDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetOrganizationsWithUsersDocument: GetOrganizationsWithUsersDocumentHetArchief,
	},
};
