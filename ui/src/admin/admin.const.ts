import { PermissionName } from '@viaa/avo2-types';
import { asyncNoop } from 'es-toolkit';
import { AdminConfigManager, ToastType } from '~core/config';
import { ContentPageService } from '~modules/content-page/services/content-page.service.ts';
import { CustomError } from '~shared/helpers/custom-error.ts';
import { isAvo } from '~shared/helpers/is-avo.ts';
import { buildLink } from '~shared/helpers/routing/link.tsx';
import { showToast } from '~shared/helpers/show-toast.ts';
import { tText } from '~shared/helpers/translation-functions.ts';
import { Locale } from '../../scripts/translation.types.ts';
import { getAdminCoreConfig } from '../shared/helpers/admin-core-config.tsx';
import type { NavigationItemInfo } from '../shared/types';

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
	return getNavWithSubLinks(
		[
			{
				navItem: {
					label: tText('admin/admin___gebruikers'),
					location: AdminConfigManager.getConfig().routes.ADMIN_USER_OVERVIEW,
					target: '_self',
					key: 'users',
					exact: false,
				},
				permission: 'VIEW_USERS',
			},
			{
				navItem: {
					label: tText('admin/admin___groepen-en-permissies'),
					location: AdminConfigManager.getConfig().routes.ADMIN_USER_GROUP_OVERVIEW,
					target: '_self',
					key: 'userGroups',
					exact: false,
				},
				permission: 'EDIT_USER_GROUPS',
			},
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
	const navInfoObj: NavigationItemInfo[] = Array.isArray(navInfos) ? navInfos : [navInfos];
	if (booleanOperator === 'OR') {
		// OR
		// If at least one of the permissions is met, render the routes
		if (permissions.some((permission) => userPermissions.includes(permission))) {
			return navInfoObj;
		}
	} else {
		// AND
		// All permissions have to be met
		if (permissions.every((permission) => userPermissions.includes(permission))) {
			return navInfoObj;
		}
	}
	return [];
}

async function getContentPageDetailRouteByPath(
	path: string,
	infoOnly = false
): Promise<string | undefined> {
	try {
		const page = await ContentPageService.getContentPageByLanguageAndPath(
			Locale.Nl,
			path,
			infoOnly
		);
		if (!page) {
			throw new CustomError('Failed to fetch content page by path, response was null', null, {
				page,
			});
		}
		return buildLink(getAdminCoreConfig(asyncNoop).routes.ADMIN_CONTENT_PAGE_DETAIL, {
			id: page.id,
		});
	} catch (err) {
		console.error(new CustomError('Failed to fetch content page by pad', err, { path }));
		showToast({
			type: ToastType.ERROR,
			description: `${tText(
				'admin/admin___het-ophalen-van-de-route-adhv-het-pagina-pad-is-mislukt'
			)}: ${path}`,
		});
		return undefined;
	}
}

export const GET_NAV_ITEMS = async (userPermissions: string[]): Promise<NavigationItemInfo[]> => {
	let contentPageQuickLinkRoutes: (string | undefined)[] = [];
	if (isAvo()) {
		contentPageQuickLinkRoutes = await Promise.all([
			getContentPageDetailRouteByPath('/', true),
			getContentPageDetailRouteByPath('/leerlingen', true),
			getContentPageDetailRouteByPath('/start', true),
		]);
	}
	return [
		...getUserNavItems(userPermissions),
		...hasPermissions([PermissionName.EDIT_NAVIGATION_BARS], 'OR', userPermissions, {
			label: tText('admin/admin___navigatie'),
			location: AdminConfigManager.getConfig().routes.ADMIN_NAVIGATION_OVERVIEW,
			target: '_self',
			key: 'navigatie',
			exact: false,
		}),
		...hasPermissions(['EDIT_ANY_CONTENT_PAGES', 'EDIT_OWN_CONTENT_PAGES'], 'OR', userPermissions, {
			label: tText('admin/admin___content-paginas'),
			location: AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_OVERVIEW,
			target: '_self',
			key: 'content',
			exact: false,
			subLinks: [
				// Only show the startpages to the users that can edit all pages
				...(isAvo() && userPermissions.includes(PermissionName.EDIT_ANY_CONTENT_PAGES)
					? [
							{
								label: tText('admin/admin___start-uitgelogd'),
								location: contentPageQuickLinkRoutes[0],
								target: '_self',
								key: 'content__start-logged-out',
								exact: true,
							},
							{
								label: tText('admin/admin___start-uitgelogd-leerlingen'),
								location: contentPageQuickLinkRoutes[1],
								target: '_self',
								key: 'content__start-logged-out-pupils',
								exact: true,
							},
							{
								label: tText('admin/admin___start-ingelogd-lesgever'),
								location: contentPageQuickLinkRoutes[2],
								target: '_self',
								key: 'content__start-logged-in-teacher',
								exact: true,
							},
						]
					: []),
			],
		}),
		...hasPermissions([PermissionName.EDIT_CONTENT_PAGE_LABELS], 'OR', userPermissions, {
			label: tText('admin/admin___content-pagina-labels'),
			location: AdminConfigManager.getConfig().routes.ADMIN_CONTENT_PAGE_LABEL_OVERVIEW,
			target: '_self',
			key: 'content-page-labels',
			exact: false,
		}),
		...hasPermissions([PermissionName.EDIT_TRANSLATIONS], 'OR', userPermissions, {
			label: tText('admin/admin___vertaling'),
			location: AdminConfigManager.getConfig().routes.ADMIN_TRANSLATIONS_OVERVIEW,
			target: '_self',
			key: 'translations',
			exact: false,
		}),
	];
};
