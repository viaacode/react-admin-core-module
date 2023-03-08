import {
	GetUserByIdQuery,
	Users_Idp_Map,
} from '../shared/generated/graphql-db-types-avo';
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

export enum Group {
	KIOSK_VISITOR = '04150e6e-b779-4125-84e5-6ee6fc580757',
	MEEMOO_ADMIN = '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
	VISITOR = '0213c8d4-f459-45ef-8bbc-96268ab56d01',
	CP_ADMIN = 'c56d95aa-e918-47ca-b102-486c9449fc4a',
}

export const GroupIdToName: Record<Group, string> = {
	[Group.KIOSK_VISITOR]: 'KIOSK_VISITOR',
	[Group.MEEMOO_ADMIN]: 'MEEMOO_ADMIN',
	[Group.VISITOR]: 'VISITOR',
	[Group.CP_ADMIN]: 'CP_ADMIN',
};

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
