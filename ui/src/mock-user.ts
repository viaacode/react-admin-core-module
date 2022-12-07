import { PermissionName } from '@viaa/avo2-types';

import { CommonUser, Idp } from '~modules/user/user.types';

export const mockUser: CommonUser = {
	profileId: 'd285a546-b42b-4fb3-bfa7-ef8be9208bc0',
	firstName: 'Meemoo',
	lastName: 'Admin',
	fullName: 'Meemoo Admin',
	email: 'meemoo.admin@example.com',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	userGroup: {
		name: 'MEEMOO_ADMIN',
		label: 'Sitebeheerder',
		id: '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
	},
	permissions: [
		PermissionName.VIEW_ADMIN_DASHBOARD,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.CREATE_CONTENT_PAGES,
		PermissionName.CAN_READ_ALL_VISIT_REQUESTS,
		PermissionName.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
		PermissionName.CAN_READ_CP_VISIT_REQUESTS,
		PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
		PermissionName.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.SEARCH,
		PermissionName.EDIT_PROTECTED_PAGE_STATUS,
		PermissionName.EDIT_CONTENT_PAGE_AUTHOR,
		PermissionName.VIEW_ANY_PUBLISHED_ITEMS,
		PermissionName.DELETE_ANY_CONTENT_PAGES,
		PermissionName.CREATE_CONTENT_PAGES,
		PermissionName.EDIT_OWN_COLLECTIONS,
		PermissionName.PUBLISH_OWN_COLLECTIONS,
		PermissionName.VIEW_OWN_COLLECTIONS,
		PermissionName.EDIT_OWN_BUNDLES,
		PermissionName.PUBLISH_OWN_BUNDLES,
		PermissionName.VIEW_OWN_BUNDLES,
		PermissionName.EDIT_OWN_ASSIGNMENTS,
		PermissionName.EDIT_ASSIGNMENTS,
		PermissionName.DELETE_OWN_BUNDLES,
		PermissionName.DELETE_OWN_COLLECTIONS,
		PermissionName.PUBLISH_ANY_CONTENT_PAGE,
		PermissionName.UNPUBLISH_ANY_CONTENT_PAGE,
		PermissionName.VIEW_ADMIN_DASHBOARD,
		PermissionName.EDIT_TRANSLATIONS,
		PermissionName.EDIT_NAVIGATION_BARS,
	],
	tempAccess: null,
};
