import type { Avo } from '@viaa/avo2-types';

import {
	type GetCommonUserByIdQuery,
	type GetUserByIdQuery,
} from '../shared/generated/graphql-db-types-avo';

import type { UserQueryTypes } from './queries/users.queries';

export interface QueryProfilesBody {
	offset: string;
	limit: string;
	sortColumn: UserOverviewTableCol;
	sortOrder: Avo.Search.OrderDirection;
	tableColumnDataType: string;
	where: string;
}

export type UserOverviewTableCol =
	| 'profileId'
	| 'firstName'
	| 'lastName'
	| 'fullName'
	| 'email'
	| 'userGroup'
	| 'businessCategory'
	| 'isException'
	| 'isBlocked'
	| 'blockedAt'
	| 'unblockedAt'
	| 'stamboek'
	| 'organisation'
	| 'createdAt'
	| 'educationLevels'
	| 'subjects'
	| 'idps'
	| 'educationalOrganisations'
	| 'lastAccessAt'
	| 'tempAccess'
	| 'tempAccessFrom'
	| 'tempAccessUntil';

export interface DeleteContentCounts {
	publicCollections: number;
	privateCollections: number;
	publicBundles: number;
	privateBundles: number;
	publicAssignments: number;
	publicAssignmentPupilCollections: number;
	privateAssignments: number;
	privateAssignmentPupilCollections: number;
	publicContentPages: number;
	privateContentPages: number;
	bookmarks: number;
	quickLanes: number;
}

export type UserInfoOverviewAvo = GetUserByIdQuery['users_summary_view'][0] &
	UserQueryTypes['GetUsersQueryAvo']['users_summary_view'][0];
export type UserInfoOverviewHetArchief =
	UserQueryTypes['GetUsersQueryHetArchief']['users_profile'][0];

export type UserInfoCommonUserAvo = GetCommonUserByIdQuery['users_common_users'][0];

export enum UserInfoType {
	AvoUserUser = 'AvoUserUser',
	AvoUserProfile = 'AvoUserProfile',
	UserInfoOverviewAvo = 'UserInfoOverviewAvo',
	UserInfoOverviewHetArchief = 'UserInfoOverviewHetArchief',
	HetArchiefUser = 'HetArchiefUser',
	UserInfoCommonUserAvo = 'UserInfoCommonUserAvo',
}
