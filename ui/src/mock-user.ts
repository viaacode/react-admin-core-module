import { CommonUser, Idp, Permission } from '~modules/user/user.types';

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
		Permission.VIEW_ADMIN_DASHBOARD,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_CONTENT_PAGE_LABELS,
		Permission.CREATE_CONTENT_PAGES,
		Permission.CAN_READ_ALL_VISIT_REQUESTS,
		Permission.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
		Permission.CAN_READ_CP_VISIT_REQUESTS,
		Permission.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
		Permission.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
		Permission.SEARCH,
		Permission.EDIT_PROTECTED_PAGE_STATUS,
		Permission.EDIT_CONTENT_PAGE_AUTHOR,
		Permission.VIEW_ANY_PUBLISHED_ITEMS,
		Permission.DELETE_ANY_CONTENT_PAGES,
		Permission.CREATE_CONTENT_PAGES,
		Permission.EDIT_OWN_COLLECTIONS,
		Permission.PUBLISH_OWN_COLLECTIONS,
		Permission.VIEW_OWN_COLLECTIONS,
		Permission.EDIT_OWN_BUNDLES,
		Permission.PUBLISH_OWN_BUNDLES,
		Permission.VIEW_OWN_BUNDLES,
		Permission.EDIT_OWN_ASSIGNMENTS,
		Permission.EDIT_ASSIGNMENTS,
		Permission.DELETE_OWN_BUNDLES,
		Permission.DELETE_OWN_COLLECTIONS,
		Permission.PUBLISH_ANY_CONTENT_PAGE,
		Permission.UNPUBLISH_ANY_CONTENT_PAGE,
		Permission.VIEW_ADMIN_DASHBOARD,
		Permission.EDIT_TRANSLATIONS,
		Permission.EDIT_NAVIGATION_BARS,
	],
	tempAccess: null,
};
