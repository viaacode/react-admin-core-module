import { FilterableTableState } from '~modules/shared/components/FilterTable/FilterTable';
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
export interface CommonUser {
	profileId: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	fullName?: string;
	acceptedTosAt?: string | null;
	idp?: Idp;
	permissions?: PermissionName[];
	stamboek?: string;
	organisation?: OrganizationSchema;
	educational_organisations?: Avo.EducationOrganization.Organization[];
	subjects?: string[];
	education_levels?: string[];
	is_exception?: boolean;
	business_category?: string;
	created_at?: string;
	userGroup?: Partial<UserGroupInfo>;
	userId?: string;
	uid?: string;
	is_blocked?: boolean;
	blocked_at?: string;
	unblocked_at?: string;
	last_access_at?: string;
	temp_access?: Avo.User.TempAccess;
	idps?: Idp[];
}

export type UserOverviewTableCol =
	| 'profileId'
	| 'firstName'
	| 'lastName'
	| 'email'
	| 'userGroup'
	| 'business_category'
	| 'is_exception'
	| 'is_blocked'
	| 'blocked_at'
	| 'unblocked_at'
	| 'stamboek'
	| 'organisation'
	| 'created_at'
	| 'education_levels'
	| 'subjects'
	| 'idps'
	| 'educational_organisations'
	| 'last_access_at'
	| 'temp_access'
	| 'temp_access_from'
	| 'temp_access_until';

export interface UserTableState extends FilterableTableState {
	first_name: string;
	last_name: string;
	mail: string;
	stamboek: string;
	business_category: string;
	is_exception: boolean;
	is_blocked: boolean;
	blocked_at: {
		date: string;
	};
	unblocked_at: {
		date: string;
	};
	created_at: string;
	education_levels: string[];
	subjects: string[];
	idps: string[];
	educational_organisations: string[];
	columns: string[];
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
