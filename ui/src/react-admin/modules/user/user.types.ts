import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { FilterableTableState } from '~modules/shared/components/FilterTable/FilterTable';
import { GetUsersQuery as GetUsersQueryHetArchief } from '~generated/graphql-db-types-hetarchief';
import { GetUsersQuery as GetUsersQueryAvo } from '~generated/graphql-db-types-avo';

export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
	SMARTSCHOOL = 'SMARTSCHOOL',
	KLASCEMENT = 'KLASCEMENT',
	VLAAMSEOVERHEID = 'VLAAMSEOVERHEID',
}

export type ProfileHetArchief = GetUsersQueryHetArchief['users_profile'][0];
export type ProfileAvo = GetUsersQueryAvo['users_summary_view'][0];

export enum Permission {
	CAN_READ_ALL_VISIT_REQUESTS = 'CAN_READ_ALL_VISIT_REQUESTS',
	CAN_APPROVE_DENY_ALL_VISIT_REQUESTS = 'CAN_APPROVE_DENY_ALL_VISIT_REQUESTS',
	CAN_READ_CP_VISIT_REQUESTS = 'CAN_READ_CP_VISIT_REQUESTS',
	CAN_APPROVE_DENY_CP_VISIT_REQUESTS = 'CAN_APPROVE_DENY_CP_VISIT_REQUESTS',
	CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	SEARCH = 'SEARCH',
	EDIT_PROTECTED_PAGE_STATUS = 'EDIT_PROTECTED_PAGE_STATUS',
	EDIT_CONTENT_PAGE_AUTHOR = 'EDIT_CONTENT_PAGE_AUTHOR',
	VIEW_ANY_PUBLISHED_ITEMS = 'VIEW_ANY_PUBLISHED_ITEMS',
	DELETE_ANY_CONTENT_PAGES = 'DELETE_ANY_CONTENT_PAGES',
	CREATE_CONTENT_PAGES = 'CREATE_CONTENT_PAGES',
	EDIT_OWN_COLLECTIONS = 'EDIT_OWN_COLLECTIONS',
	PUBLISH_OWN_COLLECTIONS = 'PUBLISH_OWN_COLLECTIONS',
	VIEW_OWN_COLLECTIONS = 'VIEW_OWN_COLLECTIONS',
	EDIT_OWN_BUNDLES = 'EDIT_OWN_BUNDLES',
	PUBLISH_OWN_BUNDLES = 'PUBLISH_OWN_BUNDLES',
	VIEW_OWN_BUNDLES = 'VIEW_OWN_BUNDLES',
	EDIT_OWN_ASSIGNMENTS = 'EDIT_OWN_ASSIGNMENTS',
	EDIT_ASSIGNMENTS = 'EDIT_ASSIGNMENTS',
	DELETE_OWN_BUNDLES = 'DELETE_OWN_BUNDLES',
	DELETE_OWN_COLLECTIONS = 'DELETE_OWN_COLLECTIONS',
	PUBLISH_ANY_CONTENT_PAGE = 'PUBLISH_ANY_CONTENT_PAGE',
	UNPUBLISH_ANY_CONTENT_PAGE = 'UNPUBLISH_ANY_CONTENT_PAGE',
	VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
	EDIT_CONTENT_PAGE_LABELS = 'EDIT_CONTENT_PAGE_LABELS',
	EDIT_ANY_USER = 'EDIT_ANY_USER',
	DELETE_ANY_USER = 'DELETE_ANY_USER',
	EDIT_USER_TEMP_ACCESS = 'EDIT_USER_TEMP_ACCESS',
	EDIT_TRANSLATIONS = 'EDIT_TRANSLATIONS',
	EDIT_NAVIGATION_BARS = 'EDIT_NAVIGATION_BARS',
	APPROVE_DENY_ALL_VISIT_REQUESTS = 'APPROVE_DENY_ALL_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
	EDIT_PERMISSION_GROUPS = 'EDIT_PERMISSION_GROUPS',
	EXPORT_OBJECT = 'EXPORT_OBJECT',
	MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
	MANAGE_FOLDERS = 'MANAGE_FOLDERS',
	READ_ALL_SPACES = 'READ_ALL_SPACES',
	READ_ALL_VISIT_REQUESTS = 'READ_ALL_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	SEARCH_ALL_OBJECTS = 'SEARCH_ALL_OBJECTS',
	SEARCH_OBJECTS = 'SEARCH_OBJECTS',
	UPDATE_ALL_SPACES = 'UPDATE_ALL_SPACES',
	EDIT_ALL_SPACES_STATUS = 'EDIT_ALL_SPACES_STATUS',
	CREATE_SPACES = 'CREATE_SPACES',
	UPDATE_OWN_SPACE = 'UPDATE_OWN_SPACE',
	UPDATE_VISIT_REQUEST = 'UPDATE_VISIT_REQUEST',
	READ_CP_VISIT_REQUESTS = 'READ_CP_VISIT_REQUESTS',
	APPROVE_DENY_CP_VISIT_REQUESTS = 'APPROVE_DENY_CP_VISIT_REQUESTS',
	CANCEL_OWN_VISIT_REQUEST = 'CANCEL_OWN_VISIT_REQUEST',
	VIEW_USERS = 'VIEW_USERS',
	SHOW_RESEARCH_WARNING = 'SHOW_RESEARCH_WARNING',
	SHOW_LINKED_SPACE_AS_HOMEPAGE = 'SHOW_LINKED_SPACE_AS_HOMEPAGE',
	CAN_EDIT_PROFILE_INFO = 'CAN_EDIT_PROFILE_INFO',
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
	status?: boolean | null;
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
	permissions?: Permission[];
	stamboek?: string;
	organisation?: OrganizationSchema;
	educationalOrganisations?: ClientEducationOrganization[];
	subjects?: string[];
	educationLevels?: string[];
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
	tempAccess: UserTempAccess | null;
	idps?: Idp[];
}

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

export interface RawUserGroup {
	id: number;
	label: string;
	group_user_permission_groups: RawUserGroupPermissionGroupLink[];
}

export interface RawUserGroupPermissionGroupLink {
	permission_group: RawPermissionGroupLink;
}

export interface RawPermissionGroupLink {
	id: number;
	label: string;
	permission_group_user_permissions: RawPermissionLink[];
}

export interface RawPermissionLink {
	permission: RawPermission;
}

export interface RawPermission {
	id: number;
	label: string;
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

export interface DeleteContentCountsRaw {
	publicCollections: {
		aggregate: {
			count: number;
		};
	};
	publicContentPages: {
		aggregate: {
			count: number;
		};
	};
	privateCollections: {
		aggregate: {
			count: number;
		};
	};
	assignments: {
		aggregate: {
			count: number;
		};
	};
	collectionBookmarks: {
		aggregate: {
			count: number;
		};
	};
	itemBookmarks: {
		aggregate: {
			count: number;
		};
	};
	privateContentPages: {
		aggregate: {
			count: number;
		};
	};
}
