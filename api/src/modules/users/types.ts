import { ClientEducationOrganization } from '@viaa/avo2-types/types/education-organizations';

export enum Permission {
	// BOTH
	SEARCH = 'SEARCH',

	// Meemoo Admin
	EDIT_ANY_CONTENT_PAGES = 'EDIT_ANY_CONTENT_PAGES',
	EDIT_OWN_CONTENT_PAGES = 'EDIT_OWN_CONTENT_PAGES',
	EDIT_CONTENT_PAGE_LABELS = 'EDIT_CONTENT_PAGE_LABELS',
	EDIT_PERMISSION_GROUPS = 'EDIT_PERMISSION_GROUPS',
	DELETE_ANY_CONTENT_PAGES = 'DELETE_ANY_CONTENT_PAGES',
	CREATE_CONTENT_PAGES = 'CREATE_CONTENT_PAGES',
	EDIT_NAVIGATION_BARS = 'EDIT_NAVIGATION_BARS',
	EDIT_USER_GROUPS = 'EDIT_USER_GROUPS',
	VIEW_USERS = 'VIEW_USERS',
	EDIT_ANY_USER = 'EDIT_ANY_USER',
	VIEW_COLLECTIONS_OVERVIEW = 'VIEW_COLLECTIONS_OVERVIEW',
	VIEW_BUNDLES_OVERVIEW = 'VIEW_BUNDLES_OVERVIEW',
	EDIT_ANY_COLLECTIONS = 'EDIT_ANY_COLLECTIONS',
	VIEW_USERS_IN_SAME_COMPANY = 'VIEW_USERS_IN_SAME_COMPANY',
	EDIT_TRANSLATIONS = 'EDIT_TRANSLATIONS',

	// HET_ARCHIEF
	// Visit Requests
	READ_ALL_VISIT_REQUESTS = 'READ_ALL_VISIT_REQUESTS',
	APPROVE_DENY_ALL_VISIT_REQUESTS = 'APPROVE_DENY_ALL_VISIT_REQUESTS',
	READ_CP_VISIT_REQUESTS = 'READ_CP_VISIT_REQUESTS',
	APPROVE_DENY_CP_VISIT_REQUESTS = 'APPROVE_DENY_CP_VISIT_REQUESTS',
	READ_PERSONAL_APPROVED_VISIT_REQUESTS = 'READ_PERSONAL_APPROVED_VISIT_REQUESTS',
	CREATE_VISIT_REQUEST = 'CREATE_VISIT_REQUEST',
	CANCEL_OWN_VISIT_REQUEST = 'CANCEL_OWN_VISIT_REQUEST',
	// Objects
	SEARCH_OBJECTS = 'SEARCH_OBJECTS',
	SEARCH_ALL_OBJECTS = 'SEARCH_ALL_OBJECTS',
	EXPORT_OBJECT = 'EXPORT_OBJECT',
	// Collections
	MANAGE_FOLDERS = 'MANAGE_FOLDERS',
	// Spaces
	/** Spaces */
	READ_ALL_SPACES = 'READ_ALL_SPACES',
	UPDATE_OWN_SPACE = 'UPDATE_OWN_SPACE',
	UPDATE_ALL_SPACES = 'UPDATE_ALL_SPACES',
	CREATE_SPACES = 'CREATE_SPACES',
	// Kiosk
	SHOW_RESEARCH_WARNING = 'SHOW_RESEARCH_WARNING',
	MANAGE_ACCOUNT = 'MANAGE_ACCOUNT',
	SHOW_LINKED_SPACE_AS_HOMEPAGE = 'SHOW_LINKED_SPACE_AS_HOMEPAGE',

	// IDP-based permission:
	CAN_EDIT_PROFILE_INFO = 'CAN_EDIT_PROFILE_INFO',

	// AVO
	EDIT_OWN_COLLECTIONS = 'EDIT_OWN_COLLECTIONS',
	CREATE_COLLECTIONS = 'CREATE_COLLECTIONS',
	ADD_HYPERLINK_COLLECTIONS = 'ADD_HYPERLINK_COLLECTIONS',
	EDIT_OWN_BUNDLES = 'EDIT_OWN_BUNDLES',
	CREATE_BUNDLES = 'CREATE_BUNDLES',
	EDIT_PROTECTED_PAGE_STATUS = 'EDIT_PROTECTED_PAGE_STATUS',
	PUBLISH_ANY_BUNDLES = 'PUBLISH_ANY_BUNDLES',
	PUBLISH_OWN_BUNDLES = 'PUBLISH_OWN_BUNDLES',
	PUBLISH_ANY_COLLECTIONS = 'PUBLISH_ANY_COLLECTIONS',
	PUBLISH_OWN_COLLECTIONS = 'PUBLISH_OWN_COLLECTIONS',
	CREATE_ASSIGNMENTS = 'CREATE_ASSIGNMENTS',
	EDIT_ANY_ASSIGNMENTS = 'EDIT_ANY_ASSIGNMENTS',
	EDIT_OWN_ASSIGNMENTS = 'EDIT_OWN_ASSIGNMENTS',
	VIEW_ASSIGNMENTS = 'VIEW_ASSIGNMENTS',
	CREATE_ASSIGNMENT_RESPONSE = 'CREATE_ASSIGNMENT_RESPONSE',
	VIEW_OWN_ASSIGNMENT_RESPONSES = 'VIEW_OWN_ASSIGNMENT_RESPONSES',
	VIEW_ANY_ASSIGNMENT_RESPONSES = 'VIEW_ANY_ASSIGNMENT_RESPONSES',
	EDIT_ANY_ASSIGNMENT_RESPONSES = 'EDIT_ANY_ASSIGNMENT_RESPONSES',
	VIEW_ADMIN_DASHBOARD = 'VIEW_ADMIN_DASHBOARD',
	EDIT_ANY_BUNDLES = 'EDIT_ANY_BUNDLES',
	DELETE_OWN_COLLECTIONS = 'DELETE_OWN_COLLECTIONS',
	DELETE_ANY_COLLECTIONS = 'DELETE_ANY_COLLECTIONS',
	DELETE_OWN_BUNDLES = 'DELETE_OWN_BUNDLES',
	DELETE_ANY_BUNDLES = 'DELETE_ANY_BUNDLES',
	VIEW_ANY_PUBLISHED_ITEMS = 'VIEW_ANY_PUBLISHED_ITEMS',
	VIEW_ANY_UNPUBLISHED_ITEMS = 'VIEW_ANY_UNPUBLISHED_ITEMS',
	CREATE_BOOKMARKS = 'CREATE_BOOKMARKS',
	PUBLISH_ITEMS = 'PUBLISH_ITEMS',
	VIEW_ITEMS_OVERVIEW = 'VIEW_ITEMS_OVERVIEW',
	EDIT_INTERACTIVE_TOURS = 'EDIT_INTERACTIVE_TOURS',
	EDIT_BAN_USER_STATUS = 'EDIT_BAN_USER_STATUS',
	VIEW_EDUCATION_LEVEL_ON_PROFILE_PAGE = 'VIEW_EDUCATION_LEVEL_ON_PROFILE_PAGE',
	EDIT_EDUCATION_LEVEL_ON_PROFILE_PAGE = 'EDIT_EDUCATION_LEVEL_ON_PROFILE_PAGE',
	REQUIRED_EDUCATION_LEVEL_ON_PROFILE_PAGE = 'REQUIRED_EDUCATION_LEVEL_ON_PROFILE_PAGE',
	VIEW_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE = 'VIEW_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE',
	EDIT_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE = 'EDIT_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE',
	REQUIRED_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE = 'REQUIRED_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE',
	VIEW_ORGANISATION_ON_PROFILE_PAGE = 'VIEW_ORGANISATION_ON_PROFILE_PAGE',
	EDIT_ORGANISATION_ON_PROFILE_PAGE = 'EDIT_ORGANISATION_ON_PROFILE_PAGE',
	REQUIRED_ORGANISATION_ON_PROFILE_PAGE = 'REQUIRED_ORGANISATION_ON_PROFILE_PAGE',
	VIEW_SUBJECTS_ON_PROFILE_PAGE = 'VIEW_SUBJECTS_ON_PROFILE_PAGE',
	EDIT_SUBJECTS_ON_PROFILE_PAGE = 'EDIT_SUBJECTS_ON_PROFILE_PAGE',
	REQUIRED_SUBJECTS_ON_PROFILE_PAGE = 'REQUIRED_SUBJECTS_ON_PROFILE_PAGE',
	VIEW_NEWSLETTERS_PAGE = 'VIEW_NEWSLETTERS_PAGE',
	VIEW_NOTIFICATIONS_PAGE = 'VIEW_NOTIFICATIONS_PAGE',
	EDIT_COLLECTION_LABELS = 'EDIT_COLLECTION_LABELS',
	EDIT_COLLECTION_AUTHOR = 'EDIT_COLLECTION_AUTHOR',
	EDIT_BUNDLE_LABELS = 'EDIT_BUNDLE_LABELS',
	EDIT_BUNDLE_AUTHOR = 'EDIT_BUNDLE_AUTHOR',
	ADD_ITEM_TO_COLLECTION_BY_PID = 'ADD_ITEM_TO_COLLECTION_BY_PID',
	ADD_COLLECTION_TO_BUNDLE_BY_ID = 'ADD_COLLECTION_TO_BUNDLE_BY_ID',
	VIEW_OWN_COLLECTIONS = 'VIEW_OWN_COLLECTIONS',
	VIEW_ANY_PUBLISHED_COLLECTIONS = 'VIEW_ANY_PUBLISHED_COLLECTIONS',
	VIEW_ANY_UNPUBLISHED_COLLECTIONS = 'VIEW_ANY_UNPUBLISHED_COLLECTIONS',
	VIEW_OWN_BUNDLES = 'VIEW_OWN_BUNDLES',
	VIEW_ANY_PUBLISHED_BUNDLES = 'VIEW_ANY_PUBLISHED_BUNDLES',
	VIEW_ANY_UNPUBLISHED_BUNDLES = 'VIEW_ANY_UNPUBLISHED_BUNDLES',
	PUBLISH_ANY_CONTENT_PAGE = 'PUBLISH_ANY_CONTENT_PAGE',
	UNPUBLISH_ANY_CONTENT_PAGE = 'UNPUBLISH_ANY_CONTENT_PAGE',
	EDIT_CONTENT_PAGE_AUTHOR = 'EDIT_CONTENT_PAGE_AUTHOR',
	VIEW_CONTENT_IN_SAME_COMPANY = 'VIEW_CONTENT_IN_SAME_COMPANY',
	DELETE_ANY_USER = 'DELETE_ANY_USER',
	VIEW_COLLECTION_EDITORIAL_OVERVIEWS = 'VIEW_COLLECTION_EDITORIAL_OVERVIEWS',
	VIEW_BUNDLE_EDITORIAL_OVERVIEWS = 'VIEW_BUNDLE_EDITORIAL_OVERVIEWS',
	EDIT_COLLECTION_EDITORIAL_STATUS = 'EDIT_COLLECTION_EDITORIAL_STATUS',
	EDIT_BUNDLE_EDITORIAL_STATUS = 'EDIT_BUNDLE_EDITORIAL_STATUS',
	EDIT_USER_TEMP_ACCESS = 'EDIT_USER_TEMP_ACCESS',
	GET_ORGANISATION_CONTENT = 'GET_ORGANISATION_CONTENT',
	// PROPOSAL: BEM-notation
	// QUICK_LANE__CREATE
	// QUICK_LANE__EDIT_OWN
	// QUICK_LANE__VIEW_DETAIL
	// QUICK_LANE__VIEW_OVERVIEW--PERSONAL
	// QUICK_LANE__VIEW_OVERVIEW--ORGANISATION
	CREATE_QUICK_LANE = 'CREATE_QUICK_LANE',
	EDIT_OWN_QUICK_LANE = 'EDIT_OWN_QUICK_LANE',
	VIEW_QUICK_LANE_DETAIL = 'VIEW_QUICK_LANE_DETAIL',
	VIEW_PERSONAL_QUICK_LANE_OVERVIEW = 'VIEW_PERSONAL_QUICK_LANE_OVERVIEW',
	VIEW_OWN_ORGANISATION_QUICK_LANE_OVERVIEW = 'VIEW_OWN_ORGANISATION_QUICK_LANE_OVERVIEW',
	VIEW_ANY_QUICK_LANE_OVERVIEW = 'VIEW_ANY_QUICK_LANE_OVERVIEW',
	VIEW_ASSOCIATED_QUICK_LANE = 'VIEW_ASSOCIATED_QUICK_LANE',
	REQUIRED_PUBLICATION_DETAILS_ON_QUICK_LANE = 'REQUIRED_PUBLICATION_DETAILS_ON_QUICK_LANE',
	AUTOPLAY_COLLECTION = 'AUTOPLAY_COLLECTION',
	VIEW_ANY_ASSIGNMENTS = 'VIEW_ANY_ASSIGNMENTS',
	DELETE_ANY_ASSIGNMENTS = 'DELETE_ANY_ASSIGNMENTS',
	VIEW_ANY_PUPIL_COLLECTIONS = 'VIEW_ANY_PUPIL_COLLECTIONS',
	EDIT_ANY_PUPIL_COLLECTIONS = 'EDIT_ANY_PUPIL_COLLECTIONS',
	DELETE_ANY_PUPIL_COLLECTIONS = 'DELETE_ANY_PUPIL_COLLECTIONS',
	SEARCH_IN_ASSIGNMENT = 'SEARCH_IN_ASSIGNMENT',
}

export interface HetArchiefUser {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	email: string;
	acceptedTosAt: string;
	groupId: string;
	groupName: string;
	permissions: Permission[];
	idp: Idp;
	maintainerId?: string;
	visitorSpaceSlug?: string;
}

export interface GqlPermission {
	name: string;
}

export interface GqlPermissionData {
	permission: GqlPermission;
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
	permissions?: Permission[];
	stamboek?: string;
	organisation?: OrganizationSchema;
	educational_organisations?: ClientEducationOrganization[];
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

export type UserBulkAction =
	| 'block'
	| 'unblock'
	| 'delete'
	| 'change_subjects'
	| 'export';

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