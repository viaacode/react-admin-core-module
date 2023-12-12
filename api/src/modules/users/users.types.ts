import { GetUserByIdQuery } from '../shared/generated/graphql-db-types-avo';
import { UserQueryTypes } from './queries/users.queries';

export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
	SMARTSCHOOL = 'SMARTSCHOOL',
	KLASCEMENT = 'KLASCEMENT',
	VLAAMSEOVERHEID = 'VLAAMSEOVERHEID',
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

export enum UserInfoType {
	AvoUserUser = 'AvoUserUser',
	AvoUserProfile = 'AvoUserProfile',
	UserInfoOverviewAvo = 'UserInfoOverviewAvo',
	UserInfoOverviewHetArchief = 'UserInfoOverviewHetArchief',
	HetArchiefUser = 'HetArchiefUser',
}
