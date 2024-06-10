import { PermissionName } from '@viaa/avo2-types';
import type { Avo } from '@viaa/avo2-types';
import { Locale } from '~modules/translations/translations.core.types';

export const mockCommonUser: Avo.User.CommonUser = {
	// QAS
	// profileId: '31051baa-94ab-4fc2-a859-750a52774d3a',
	// LOCAL
	profileId: '8cd21983-92ff-4e67-8f6d-9640cac67073',
	email: 'hetarchief2.0+bztmeemooadmin@meemoo.be',
	firstName: 'meemoo',
	lastName: 'Admin',
	fullName: 'meemoo Admin',
	language: Locale.Nl,
	userGroup: {
		id: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
		name: 'CP_ADMIN',
		label: 'CP_ADMIN',
	},
	idps: {
		HETARCHIEF: null,
	},
	organisation: {
		or_id: 'OR-w66976m',
		data: null,
	} as any,
	loms: [],
	permissions: [
		PermissionName.APPROVE_DENY_CP_VISIT_REQUESTS,
		PermissionName.CANCEL_OWN_VISIT_REQUEST,
		PermissionName.CREATE_MATERIAL_REQUESTS,
		PermissionName.CREATE_VISIT_REQUEST,
		PermissionName.EXPORT_OBJECT,
		PermissionName.MANAGE_ACCOUNT,
		PermissionName.MANAGE_FOLDERS,
		PermissionName.READ_CP_VISIT_REQUESTS,
		PermissionName.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		PermissionName.SEARCH_OBJECTS,
		PermissionName.UPDATE_OWN_SPACE,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS,
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.CAN_EDIT_PROFILE_INFO,

		PermissionName.SEARCH,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES,
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.EDIT_PERMISSION_GROUPS,
		PermissionName.DELETE_ANY_CONTENT_PAGES,
		PermissionName.CREATE_CONTENT_PAGES,
		PermissionName.EDIT_NAVIGATION_BARS,
		PermissionName.EDIT_USER_GROUPS,
		PermissionName.VIEW_USERS,
		PermissionName.EDIT_ANY_USER,
		PermissionName.VIEW_COLLECTIONS_OVERVIEW,
		PermissionName.VIEW_BUNDLES_OVERVIEW,
		PermissionName.EDIT_ANY_COLLECTIONS,
		PermissionName.VIEW_USERS_IN_SAME_COMPANY,
		PermissionName.EDIT_TRANSLATIONS,
		PermissionName.READ_ALL_VISIT_REQUESTS,
		PermissionName.APPROVE_DENY_ALL_VISIT_REQUESTS,
		PermissionName.READ_CP_VISIT_REQUESTS,
		PermissionName.APPROVE_DENY_CP_VISIT_REQUESTS,
		PermissionName.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		PermissionName.CREATE_VISIT_REQUEST,
		PermissionName.CANCEL_OWN_VISIT_REQUEST,
		PermissionName.CAN_READ_ALL_VISIT_REQUESTS,
		PermissionName.CAN_APPROVE_DENY_ALL_VISIT_REQUESTS,
		PermissionName.CAN_READ_CP_VISIT_REQUESTS,
		PermissionName.CAN_APPROVE_DENY_CP_VISIT_REQUESTS,
		PermissionName.CAN_READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		PermissionName.EDIT_ASSIGNMENTS,
		PermissionName.EDIT_ALL_SPACES_STATUS,
		PermissionName.UPDATE_VISIT_REQUEST,
		PermissionName.SEARCH_OBJECTS,
		PermissionName.SEARCH_ALL_OBJECTS,
		PermissionName.EXPORT_OBJECT,
		PermissionName.MANAGE_FOLDERS,
		PermissionName.READ_ALL_SPACES,
		PermissionName.UPDATE_OWN_SPACE,
		PermissionName.UPDATE_ALL_SPACES,
		PermissionName.CREATE_SPACES,
		PermissionName.SHOW_RESEARCH_WARNING,
		PermissionName.MANAGE_ACCOUNT,
		PermissionName.SHOW_LINKED_SPACE_AS_HOMEPAGE,
		PermissionName.CAN_EDIT_PROFILE_INFO,
		PermissionName.EDIT_OWN_COLLECTIONS,
		PermissionName.CREATE_COLLECTIONS,
		PermissionName.ADD_HYPERLINK_COLLECTIONS,
		PermissionName.EDIT_OWN_BUNDLES,
		PermissionName.CREATE_BUNDLES,
		PermissionName.EDIT_PROTECTED_PAGE_STATUS,
		PermissionName.PUBLISH_ANY_BUNDLES,
		PermissionName.PUBLISH_OWN_BUNDLES,
		PermissionName.PUBLISH_ANY_COLLECTIONS,
		PermissionName.PUBLISH_OWN_COLLECTIONS,
		PermissionName.CREATE_ASSIGNMENTS,
		PermissionName.EDIT_ANY_ASSIGNMENTS,
		PermissionName.EDIT_OWN_ASSIGNMENTS,
		PermissionName.VIEW_ASSIGNMENTS,
		PermissionName.CREATE_ASSIGNMENT_RESPONSE,
		PermissionName.VIEW_OWN_ASSIGNMENT_RESPONSES,
		PermissionName.VIEW_ANY_ASSIGNMENT_RESPONSES,
		PermissionName.EDIT_ANY_ASSIGNMENT_RESPONSES,
		PermissionName.VIEW_ADMIN_DASHBOARD,
		PermissionName.EDIT_ANY_BUNDLES,
		PermissionName.DELETE_OWN_COLLECTIONS,
		PermissionName.DELETE_ANY_COLLECTIONS,
		PermissionName.DELETE_OWN_BUNDLES,
		PermissionName.DELETE_ANY_BUNDLES,
		PermissionName.VIEW_ANY_PUBLISHED_ITEMS,
		PermissionName.VIEW_ANY_UNPUBLISHED_ITEMS,
		PermissionName.CREATE_BOOKMARKS,
		PermissionName.PUBLISH_ITEMS,
		PermissionName.VIEW_ITEMS_OVERVIEW,
		PermissionName.EDIT_INTERACTIVE_TOURS,
		PermissionName.EDIT_BAN_USER_STATUS,
		PermissionName.VIEW_EDUCATION_LEVEL_ON_PROFILE_PAGE,
		PermissionName.EDIT_EDUCATION_LEVEL_ON_PROFILE_PAGE,
		PermissionName.REQUIRED_EDUCATION_LEVEL_ON_PROFILE_PAGE,
		PermissionName.VIEW_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE,
		PermissionName.EDIT_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE,
		PermissionName.REQUIRED_EDUCATIONAL_ORGANISATION_ON_PROFILE_PAGE,
		PermissionName.VIEW_ORGANISATION_ON_PROFILE_PAGE,
		PermissionName.EDIT_ORGANISATION_ON_PROFILE_PAGE,
		PermissionName.REQUIRED_ORGANISATION_ON_PROFILE_PAGE,
		PermissionName.VIEW_SUBJECTS_ON_PROFILE_PAGE,
		PermissionName.EDIT_SUBJECTS_ON_PROFILE_PAGE,
		PermissionName.REQUIRED_SUBJECTS_ON_PROFILE_PAGE,
		PermissionName.VIEW_NEWSLETTERS_PAGE,
		PermissionName.VIEW_NOTIFICATIONS_PAGE,
		PermissionName.EDIT_COLLECTION_QUALITY_LABELS,
		PermissionName.EDIT_COLLECTION_AUTHOR,
		PermissionName.EDIT_BUNDLE_QUALITY_LABELS,
		PermissionName.EDIT_BUNDLE_AUTHOR,
		PermissionName.ADD_ITEM_TO_COLLECTION_BY_PID,
		PermissionName.ADD_COLLECTION_TO_BUNDLE_BY_ID,
		PermissionName.VIEW_OWN_COLLECTIONS,
		PermissionName.VIEW_ANY_PUBLISHED_COLLECTIONS,
		PermissionName.VIEW_ANY_UNPUBLISHED_COLLECTIONS,
		PermissionName.VIEW_OWN_BUNDLES,
		PermissionName.VIEW_ANY_PUBLISHED_BUNDLES,
		PermissionName.VIEW_ANY_UNPUBLISHED_BUNDLES,
		PermissionName.PUBLISH_ANY_CONTENT_PAGE,
		PermissionName.UNPUBLISH_ANY_CONTENT_PAGE,
		PermissionName.EDIT_CONTENT_PAGE_AUTHOR,
		PermissionName.VIEW_CONTENT_IN_SAME_COMPANY,
		PermissionName.DELETE_ANY_USER,
		PermissionName.VIEW_COLLECTION_EDITORIAL_OVERVIEWS,
		PermissionName.VIEW_BUNDLE_EDITORIAL_OVERVIEWS,
		PermissionName.EDIT_COLLECTION_EDITORIAL_STATUS,
		PermissionName.EDIT_BUNDLE_EDITORIAL_STATUS,
		PermissionName.EDIT_USER_TEMP_ACCESS,
		PermissionName.GET_ORGANISATION_CONTENT,
		PermissionName.CREATE_QUICK_LANE,
		PermissionName.EDIT_OWN_QUICK_LANE,
		PermissionName.VIEW_QUICK_LANE_DETAIL,
		PermissionName.VIEW_PERSONAL_QUICK_LANE_OVERVIEW,
		PermissionName.VIEW_OWN_ORGANISATION_QUICK_LANE_OVERVIEW,
		PermissionName.VIEW_ANY_QUICK_LANE_OVERVIEW,
		PermissionName.VIEW_ASSOCIATED_QUICK_LANE,
		PermissionName.REQUIRED_PUBLICATION_DETAILS_ON_QUICK_LANE,
		PermissionName.AUTOPLAY_COLLECTION,
		PermissionName.VIEW_ANY_ASSIGNMENTS,
		PermissionName.DELETE_ANY_ASSIGNMENTS,
		PermissionName.VIEW_ANY_PUPIL_COLLECTIONS,
		PermissionName.EDIT_ANY_PUPIL_COLLECTIONS,
		PermissionName.DELETE_ANY_PUPIL_COLLECTIONS,
		PermissionName.SEARCH_IN_ASSIGNMENT,
	],
};
