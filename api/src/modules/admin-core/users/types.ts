import { Idp } from '../shared/auth/auth.types';

export enum Permission {
	SEARCH = 'SEARCH',
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
	// IDP-based permission:
	CAN_EDIT_PROFILE_INFO = 'CAN_EDIT_PROFILE_INFO',
}

export interface User {
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
