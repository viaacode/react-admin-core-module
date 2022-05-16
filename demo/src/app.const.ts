import { every, isArray, some } from 'lodash-es';
import { Config, ToastType } from '~core/config';
import { CONTENT_PAGE_LABEL_PATH } from '~modules/content-page-labels/content-page-label.const';
import { CONTENT_PATH } from '~modules/content-page/const/content-page.consts';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { buildLink } from '~modules/shared/helpers/link';
import { USER_GROUP_PATH } from '~modules/user-group/const/user-group.const';
// import { USER_PATH } from '~modules/user/user.consts';
import { NavigationItemInfo } from './shared/types';

export const ADMIN_PATH = Object.freeze({
	// ...DASHBOARD_PATH,
	// ...USER_PATH,
	...USER_GROUP_PATH,
	// ...MENU_PATH,
	...CONTENT_PATH,
	...CONTENT_PAGE_LABEL_PATH,
	// ...TRANSLATIONS_PATH,
	// ...PERMISSION_GROUP_PATH,
	// ...COLLECTIONS_OR_BUNDLES_PATH,
	// ...ITEMS_PATH,
	// ...INTERACTIVE_TOUR_PATH,
	// ...QUICK_LANE_PATH,
});

function getNavWithSubLinks(
	itemsAndPermissions: { navItem: NavigationItemInfo; permission: string }[],
	userPermissions: string[]
): NavigationItemInfo[] {
	const availableNavItems: NavigationItemInfo[] = [];
	itemsAndPermissions.forEach((navItemAndPermission) => {
		if (userPermissions.includes(navItemAndPermission.permission)) {
			availableNavItems.push(navItemAndPermission.navItem);
		}
	});
	if (availableNavItems[0]) {
		// The first item we'll show as the main nav item
		return [
			{
				...availableNavItems[0],
				// Any other items will show up as sublinks
				subLinks: availableNavItems.slice(1),
			},
		];
	}
	// None of the items the current user can see
	return [];
}

function getUserNavItems(userPermissions: string[]): NavigationItemInfo[] {
	const i18n = Config.getConfig().services.i18n;
	return getNavWithSubLinks(
		[
			// {
			// 	navItem: {
			// 		label: i18n.t('admin/admin___gebruikers'),
			// 		location: ADMIN_PATH.USER_OVERVIEW,
			// 		key: 'users',
			// 		exact: false,
			// 	},
			// 	permission: 'VIEW_USERS',
			// },
			// {
			// 	navItem: {
			// 		label: i18n.t('admin/admin___gebruikersgroepen'),
			// 		location: ADMIN_PATH.USER_GROUP_OVERVIEW,
			// 		key: 'userGroups',
			// 		exact: false,
			// 	},
			// 	permission: 'EDIT_USER_GROUPS',
			// },
			// {
			// 	navItem: {
			// 		label: i18n.t('admin/admin___permissie-groepen'),
			// 		location: ADMIN_PATH.PERMISSION_GROUP_OVERVIEW,
			// 		key: 'permissionGroups',
			// 		exact: false,
			// 	},
			// 	permission: 'EDIT_PERMISSION_GROUPS',
			// },
		],
		userPermissions
	);
}

function hasPermissions(
	permissions: string[],
	booleanOperator: 'AND' | 'OR',
	userPermissions: string[],
	navInfos: NavigationItemInfo | NavigationItemInfo[]
): NavigationItemInfo[] {
	const navInfoObj: NavigationItemInfo[] = isArray(navInfos) ? navInfos : [navInfos];
	if (booleanOperator === 'OR') {
		// OR
		// If at least one of the permissions is met, render the routes
		if (some(permissions, (permission) => userPermissions.includes(permission))) {
			return navInfoObj;
		}
	} else {
		// AND
		// All permissions have to be met
		if (every(permissions, (permission) => userPermissions.includes(permission))) {
			return navInfoObj;
		}
	}
	return [];
}

async function getContentPageDetailRouteByPath(path: string): Promise<string | undefined> {
	try {
		const page = await ContentPageService.getContentPageByPath(path);
		if (!page) {
			throw new CustomError('Failed to fetch content page by path, response was null', null, {
				page,
			});
		}
		return buildLink(CONTENT_PATH.CONTENT_PAGE_DETAIL, { id: page.id });
	} catch (err) {
		console.error(new CustomError('Failed to fetch content page by pad', err, { path }));
		Config.getConfig().services.toastService.showToast({
			title: Config.getConfig().services.i18n.t('Error'),
			description: `${Config.getConfig().services.i18n.t(
				'admin/admin___het-ophalen-van-de-route-adhv-het-pagina-pad-is-mislukt'
			)}: ${path}`,
			type: ToastType.ERROR,
		});
		return undefined;
	}
}

export const GET_NAV_ITEMS = async (userPermissions: string[]): Promise<NavigationItemInfo[]> => {
	const i18n = Config.getConfig().services.i18n;
	return [
		...getUserNavItems(userPermissions),
		// ...hasPermissions(['EDIT_NAVIGATION_BARS'], 'OR', userPermissions, {
		// 	label: i18n.t('admin/admin___navigatie'),
		// 	location: ADMIN_PATH.MENU_OVERVIEW,
		// 	key: 'navigatie',
		// 	exact: false,
		// }),
		...hasPermissions(
			['EDIT_ANY_CONTENT_PAGES', 'EDIT_OWN_CONTENT_PAGES'],
			'OR',
			userPermissions,
			{
				label: i18n.t('admin/admin___content-paginas'),
				location: ADMIN_PATH.CONTENT_PAGE_OVERVIEW,
				key: 'content',
				exact: false,
				subLinks: [
					{
						label: i18n.t('admin/admin___paginas'),
						location: ADMIN_PATH.PAGES,
						key: 'pages',
						exact: true,
					},
					{
						label: i18n.t('admin/admin___projecten'),
						location: ADMIN_PATH.PROJECTS,
						key: 'projects',
						exact: true,
					},
					{
						label: i18n.t('admin/admin___nieuws'),
						location: ADMIN_PATH.NEWS,
						key: 'news',
						exact: true,
					},
					{
						label: i18n.t('admin/admin___screencasts'),
						location: ADMIN_PATH.SCREENCASTS,
						key: 'screencasts',
						exact: true,
					},
					{
						label: i18n.t('admin/admin___fa-qs'),
						location: ADMIN_PATH.FAQS,
						key: 'faqs',
						exact: true,
					},
					{
						label: i18n.t('admin/admin___overzichtspaginas'),
						location: ADMIN_PATH.OVERVIEWS,
						key: 'faqs',
						exact: true,
					},
					// // Only show the startpages to the users that can edit all pages
					// ...(userPermissions.includes(Permission.EDIT_ANY_CONTENT_PAGES)
					// 	? [
					// 			{
					// 				label: i18n.t('admin/admin___start-uitgelogd'),
					// 				location: await getContentPageDetailRouteByPath('/'),
					// 				key: 'faqs',
					// 				exact: true,
					// 			},
					// 			{
					// 				label: i18n.t('admin/admin___start-uitgelogd-leerlingen'),
					// 				location: await getContentPageDetailRouteByPath('/leerlingen'),
					// 				key: 'faqs',
					// 				exact: true,
					// 			},
					// 			{
					// 				label: i18n.t('admin/admin___start-ingelogd-lesgever'),
					// 				location: await getContentPageDetailRouteByPath('/start'),
					// 				key: 'faqs',
					// 				exact: true,
					// 			},
					// 	  ]
					// 	: []),
				],
			}
		),
		...hasPermissions(['EDIT_CONTENT_PAGE_LABELS'], 'OR', userPermissions, {
			label: i18n.t('admin/admin___content-pagina-labels'),
			location: ADMIN_PATH.CONTENT_PAGE_LABEL_OVERVIEW,
			key: 'content-page-labels',
			exact: false,
		}),
		// ...hasPermissions([], 'OR', userPermissions,
		{
			label: i18n.t('Gebruikersgroep'),
			location: ADMIN_PATH.USER_GROUP_OVERVIEW,
			key: 'user-group',
			exact: false,
		},
		// {
		// 	label: i18n.t('Gebruikers'),
		// 	location: ADMIN_PATH.USER_OVERVIEW,
		// 	key: 'users',
		// 	exact: false,
		// }
		// ),
		// ...hasPermissions(['EDIT_TRANSLATIONS'], 'OR', userPermissions, {
		// 	label: i18n.t('admin/admin___vertaling'),
		// 	location: ADMIN_PATH.TRANSLATIONS,
		// 	key: 'translations',
		// 	exact: false,
		// }),
	];
};
