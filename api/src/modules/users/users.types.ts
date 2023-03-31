import { GetUserByIdQuery, Users_Idp_Map } from '../shared/generated/graphql-db-types-avo';
import { UserQueryTypes } from './queries/users.queries';
import { PermissionName } from '@viaa/avo2-types';
import type { Avo } from '@viaa/avo2-types';

export interface HetArchiefUser {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	acceptedTosAt: string;
	groupId: string;
	groupName: string;
	permissions: PermissionName[];
	idp: Idp;
	maintainerId?: string;
	visitorSpaceSlug?: string;
}

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
	assignments: number;
	bookmarks: number;
	publicContentPages: number;
	privateContentPages: number;
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
