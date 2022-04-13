import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';
import { FilterableTableState } from '~modules/shared/components/FilterTable/FilterTable';

export enum Idp {
	HETARCHIEF = 'HETARCHIEF',
	MEEMOO = 'MEEMOO',
	SMARTSCHOOL = 'SMARTSCHOOL',
	KLASCEMENT = 'KLASCEMENT',
	VLAAMSEOVERHEID = 'VLAAMSEOVERHEID',
}

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
	educational_organisations?: ClientEducationOrganization[];
	subjects?: string[];
	education_levels?: string[];
	is_exception?: boolean;
	business_category?: string;
	created_at?: string;
	userGroup?: string;
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
	| 'id'
	| 'first_name'
	| 'last_name'
	| 'mail'
	| 'user_group'
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