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

export interface UserTempAccess {
	from?: string | null;
	until?: string | null;
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
	temp_access?: UserTempAccess;
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

export interface DeleteContentCounts {
	publicCollections: number;
	privateCollections: number;
	assignments: number;
	bookmarks: number;
	publicContentPages: number;
	privateContentPages: number;
}

export type ProfileAvo =
	UserQueryTypes['GetUsersQueryAvo']['users_summary_view'][0];
export type ProfileHetArchief =
	UserQueryTypes['GetUsersQueryHetArchief']['users_profile'][0];
