import { FilterableTableState } from '~shared/components/FilterTable/FilterTable';
import { GetUsersQuery as GetUsersQueryHetArchief } from '~generated/graphql-db-types-hetarchief';
import { GetUsersQuery as GetUsersQueryAvo } from '~generated/graphql-db-types-avo';
import { PermissionName } from '@viaa/avo2-types';
import type { Avo } from '@viaa/avo2-types';

export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
	SMARTSCHOOL = 'SMARTSCHOOL',
	KLASCEMENT = 'KLASCEMENT',
	VLAAMSEOVERHEID = 'VLAAMSEOVERHEID',
}

export type ProfileHetArchief = GetUsersQueryHetArchief['users_profile'][0];
export type ProfileAvo = GetUsersQueryAvo['users_summary_view'][0];

export const USERS_PER_PAGE = 50;

export interface OrganizationContactInfo {
	phone?: string;
	website?: string;
	email?: string;
	logoUrl?: string;
	form_url?: string;
}

export interface OrganizationData {
	or_id: string;
	cp_name: string;
	category?: string;
	sector?: string;
	cp_name_catpro?: string;
	description?: string;
	contact_information: OrganizationContactInfo;
	accountmanager?: string;
}

export interface OrganizationSchema {
	or_id: string;
	name?: string;
	logo_url?: string;
	description?: string;
	website?: string;
	data?: OrganizationData;
}

export interface UserGroupInfo {
	label: string;
	name: string;
	id: string | number; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
}

/**
 * User model for both hetarchief and avo
 */
export type CommonUser = {
	profileId: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	avatar?: string;
	acceptedTosAt?: string | null;
	idp?: Idp;
	permissions?: PermissionName[];
	stamboek?: string;
	organisation?: OrganizationSchema;
	educationalOrganisations?: Avo.EducationOrganization.Organization[];
	subjects?: string[]; // classifications
	educationLevels?: string[]; // contexts
	isException?: boolean;
	businessCategory?: string;
	createdAt?: string;
	userGroup?: Partial<UserGroupInfo>;
	userId?: string;
	uid?: string;
	isBlocked?: boolean;
	blockedAt?: string;
	unblockedAt?: string;
	lastAccessAt?: string;
	tempAccess?: Avo.User.TempAccess;
	idps?: Partial<Record<Idp, string | null>>;
	alias?: string;
	title?: string;
	bio?: string;
	alternativeEmail?: string;
	updatedAt?: string;
	companyId?: string;
};

export type UserOverviewTableCol =
	| 'profileId'
	| 'firstName'
	| 'lastName'
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

export interface UserTableState extends FilterableTableState {
	firstName: string;
	lastName: string;
	mail: string;
	stamboek: string;
	businessCategory: string[];
	isException: boolean;
	isBlocked: boolean;
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
}

export type UserBulkAction = 'block' | 'unblock' | 'delete' | 'change_subjects' | 'export';

export interface DeleteContentCounts {
	publicCollections: number;
	privateCollections: number;
	assignments: number;
	bookmarks: number;
	publicContentPages: number;
	privateContentPages: number;
}
