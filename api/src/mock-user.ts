import { Avo, PermissionName } from '@viaa/avo2-types';
import { Idp } from './modules';

export const mockUserAvo: Avo.User.User = {
	first_name: 'Bert',
	last_name: 'Verhelst',
	full_name: 'Bert Verhelst',
	temp_access: null,
	is_blocked: false,
	profile: {
		id: '69ccef3b-751a-4be4-95bc-5ef365fbd504',
		alias: 'bert_verhelst',
		title: 'Developer1',
		alternative_email: 'verhelstbert@gmail.comaaaaaaa',
		avatar: 'https://assets-qas.hetarchief.be//avo2/PROFILE_AVATAR/bert-359813c0-3b43-11ed-937e-adfb7fd0632b.jpg',
		created_at: '2019-10-23T16:22:47.543339+00:00',
		stamboek: '',
		bio: 'Ik ben een developer bij Studio Hyperdrive',
		updated_at: '2022-11-28T08:23:35.658+00:00',
		user_id: '517aec71-cf0e-4e08-99d1-8e7e042923f7',
		is_exception: true,
		business_category: 'VDAB',
		company_id: 'OR-h41jm1d',
		organisation: {
			logo_url: 'https://assets-qas.viaa.be/images/OR-h41jm1d',
			name: 'meemoo - Het Archief voor Onderwijs',
			or_id: 'OR-h41jm1d',
		} as any,
		loms: [],
		user: undefined,
		userGroupIds: ['1'] as any,
		permissions: [
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
			PermissionName.EDIT_COLLECTION_LABELS,
			PermissionName.EDIT_COLLECTION_AUTHOR,
			PermissionName.EDIT_BUNDLE_LABELS,
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
		educationLevels: ['Deeltijds kunstonderwijs', 'Secundair onderwijs'],
		subjects: ['autotechniek', 'burgerzin'],
		organizations: [{ organizationId: 'OR-b853h7v', unitId: null, label: 'VDAB' } as any],
	},
	created_at: '2019-10-23T16:21:17.984884+00:00',
	expires_at: null,
	last_access_at: '2022-11-28T14:14:44.713+00:00',
	external_uid: null,
	role: { label: 'Beheerder', name: 'admin' } as any,
	role_id: 1,
	uid: '517aec71-cf0e-4e08-99d1-8e7e042923f7',
	updated_at: '2022-11-28T08:23:35.658+00:00',
	mail: 'bert.verhelst@studiohyperdrive.be',
	idpmaps: ['HETARCHIEF', 'KLASCEMENT', 'VLAAMSEOVERHEID__SUB_ID'],
	idpmapObjects: [
		{
			idp: 'HETARCHIEF',
			idp_user_id: '5eb99992-74a9-1039-9277-2bea2ee8ec01',
		},
		{
			idp: 'KLASCEMENT',
			idp_user_id: '5e7c68a6543c5',
		},
		{
			idp: 'VLAAMSEOVERHEID__SUB_ID',
			idp_user_id: '4d2b556cd6bffa86869507455afb0ee7329f41f2',
		},
	],
} as Avo.User.User;

export const mockUserHetArchief: Avo.User.HetArchiefUser = {
	id: 'd285a546-b42b-4fb3-bfa7-ef8be9208bc0',
	fullName: 'meemoo Admin',
	firstName: 'meemoo',
	lastName: 'Admin',
	email: 'hetarchief2.0+bztmeemooadmin@meemoo.be',
	acceptedTosAt: '2023-03-31T14:30:25.086+02:00',
	groupId: '0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
	groupName: 'MEEMOO_ADMIN',
	permissions: [
		PermissionName.APPROVE_DENY_ALL_VISIT_REQUESTS,
		PermissionName.CANCEL_OWN_VISIT_REQUEST,
		PermissionName.CREATE_CONTENT_PAGES,
		PermissionName.CREATE_MAINTENANCE_ALERTS,
		PermissionName.CREATE_SPACES,
		PermissionName.CREATE_VISIT_REQUEST,
		PermissionName.DELETE_ANY_CONTENT_PAGES,
		PermissionName.DELETE_MAINTENANCE_ALERTS,
		PermissionName.EDIT_ALL_SPACES_STATUS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_CONTENT_PAGE_AUTHOR,
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.EDIT_MAINTENANCE_ALERTS,
		PermissionName.EDIT_NAVIGATION_BARS,
		PermissionName.EDIT_PERMISSION_GROUPS,
		PermissionName.EDIT_PROTECTED_PAGE_STATUS,
		PermissionName.EDIT_TRANSLATIONS,
		PermissionName.EDIT_USER_GROUPS,
		PermissionName.EXPORT_OBJECT,
		PermissionName.MANAGE_ACCOUNT,
		PermissionName.MANAGE_FOLDERS,
		PermissionName.PUBLISH_ANY_CONTENT_PAGE,
		PermissionName.READ_ALL_SPACES,
		PermissionName.READ_ALL_VISIT_REQUESTS,
		PermissionName.READ_PERSONAL_APPROVED_VISIT_REQUESTS,
		PermissionName.SEARCH_ALL_OBJECTS,
		PermissionName.SEARCH_OBJECTS,
		PermissionName.UNPUBLISH_ANY_CONTENT_PAGE,
		PermissionName.UPDATE_ALL_SPACES,
		PermissionName.VIEW_ADMIN_DASHBOARD,
		PermissionName.VIEW_ANY_MAINTENANCE_ALERTS,
		PermissionName.CREATE_MATERIAL_REQUESTS,
		PermissionName.DELETE_OWN_MATERIAL_REQUESTS,
		PermissionName.EDIT_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_ANY_MATERIAL_REQUESTS,
		PermissionName.VIEW_OWN_MATERIAL_REQUESTS,
		PermissionName.VIEW_USERS,
		PermissionName.CAN_EDIT_PROFILE_INFO,
	],
	idp: 'HETARCHIEF' as Idp,
	isKeyUser: false,
	lastAccessAt: '2023-04-04T18:51:03.032+02:00',
	createdAt: '2023-01-30T16:26:38.875447',
	organisationName: null,
	maintainerId: 'OR-w66976m',
	organisationId: null,
	sector: null,
};
