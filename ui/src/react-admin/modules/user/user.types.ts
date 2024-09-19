import type { FilterableTableState } from '~shared/components/FilterTable/FilterTable';

export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
	SMARTSCHOOL = 'SMARTSCHOOL',
	KLASCEMENT = 'KLASCEMENT',
	VLAAMSEOVERHEID = 'VLAAMSEOVERHEID',
}

export const USERS_PER_PAGE = 50;

export type UserOverviewTableCol =
	| 'profileId'
	| 'fullName'
	| 'email'
	| 'userGroup'
	| 'businessCategory'
	| 'isException'
	| 'isBlocked'
	| 'isKeyUser'
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
	| 'tempAccessUntil'
	| 'actions';

export interface UserTableState extends FilterableTableState {
	fullName: string;
	mail: string;
	stamboek: string;
	businessCategory: string[];
	isException: boolean;
	isBlocked: boolean;
	isKeyUser: boolean;
	blockedAt: {
		date: string;
	};
	unblockedAt: {
		date: string;
	};
	createdAt: string;
	educationLevels: string[];
	subjects: string[];
	idps: string[];
	educationalOrganisations: string[];
	organisation: string[];
	columns: string[];
	userGroup: string[];
	tempAccess: string[];
	lastAccessAt: { date: string };
}

export type UserBulkAction = 'block' | 'unblock' | 'delete' | 'change_subjects' | 'export';

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
