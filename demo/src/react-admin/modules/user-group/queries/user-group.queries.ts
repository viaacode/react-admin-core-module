import { AvoOrHetArchief } from '../../shared/types';

import {
	DeleteUserGroupDocument as DeleteUserGroupDocumentAvo,
	GetUserGroupByIdDocument as GetUserGroupByIdDocumentAvo,
	GetUserGroupsWithFiltersDocument as GetUserGroupsWithFiltersDocumentAvo,
	InsertUserGroupDocument as InsertUserGroupDocumentAvo,
	UpdateUserGroupDocument as UpdateUserGroupDocumentAvo,
} from '~generated/graphql-db-types-avo';
import {
	DeleteUserGroupDocument as DeleteUserGroupDocumentHetArchief,
	GetUserGroupByIdDocument as GetUserGroupByIdDocumentHetArchief,
	GetUserGroupsWithFiltersDocument as GetUserGroupsWithFiltersDocumentHetArchief,
	InsertUserGroupDocument as InsertUserGroupDocumentHetArchief,
	UpdateUserGroupDocument as UpdateUserGroupDocumentHetArchief,
} from '~generated/graphql-db-types-hetarchief';

interface UserGroupQueries {
	GetUserGroupByIdDocument: string;
	GetUserGroupsWithFiltersDocument: string;
	InsertUserGroupDocument: string;
	UpdateUserGroupDocument: string;
	DeleteUserGroupDocument: string;
}

export const USER_GROUP_QUERIES: Record<AvoOrHetArchief, UserGroupQueries> = {
	[AvoOrHetArchief.avo]: {
		GetUserGroupsWithFiltersDocument: GetUserGroupsWithFiltersDocumentAvo,
		GetUserGroupByIdDocument: GetUserGroupByIdDocumentAvo,
		InsertUserGroupDocument: InsertUserGroupDocumentAvo,
		UpdateUserGroupDocument: UpdateUserGroupDocumentAvo,
		DeleteUserGroupDocument: DeleteUserGroupDocumentAvo,
	},
	[AvoOrHetArchief.hetArchief]: {
		GetUserGroupsWithFiltersDocument: GetUserGroupsWithFiltersDocumentHetArchief,
		GetUserGroupByIdDocument: GetUserGroupByIdDocumentHetArchief,
		InsertUserGroupDocument: InsertUserGroupDocumentHetArchief,
		UpdateUserGroupDocument: UpdateUserGroupDocumentHetArchief,
		DeleteUserGroupDocument: DeleteUserGroupDocumentHetArchief,
	},
};
