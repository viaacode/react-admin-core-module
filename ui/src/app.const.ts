import { AdminConfigManager } from '~core/config';
import { NavigationItemInfo } from './shared/types';

export const GET_NAV_ITEMS = async (): Promise<NavigationItemInfo[]> => {
	const i18n = AdminConfigManager.getConfig().services.i18n;
	return [
		{
			label: i18n.tHtml('app___gebruikers'),
			location: AdminConfigManager.getConfig().routes.USER_OVERVIEW,
			key: 'users',
			exact: false,
			subLinks: [
				{
					label: i18n.tHtml('Groepen en permissies'),
					location: AdminConfigManager.getConfig().routes.USER_GROUP_OVERVIEW,
					key: 'user-group',
					exact: false,
				},
			],
		},
		{
			label: i18n.tHtml('admin/admin___navigatie'),
			location: AdminConfigManager.getConfig().routes.NAVIGATION_OVERVIEW,
			key: 'navigatie',
			exact: false,
		},
		{
			label: i18n.tHtml('admin/admin___content-paginas'),
			location: AdminConfigManager.getConfig().routes.CONTENT_PAGE_OVERVIEW,
			key: 'content',
			exact: false,
			subLinks: [
				{
					label: i18n.tHtml('Start: uitgelogd'),
					location: AdminConfigManager.getConfig().routes.CONTENT_PAGE_OVERVIEW + '/195',
					key: 'pages',
					exact: true,
				},
				{
					label: i18n.tHtml('Start: uitgelogd leerlingen'),
					location: AdminConfigManager.getConfig().routes.CONTENT_PAGE_OVERVIEW + '/236',
					key: 'faqs',
					exact: true,
				},
				{
					label: i18n.tHtml('Start: uitgelogd lesgever'),
					location: AdminConfigManager.getConfig().routes.CONTENT_PAGE_OVERVIEW + '/313',
					key: 'faqs',
					exact: true,
				},
			],
		},
		{
			label: i18n.tHtml('app___vertalingen'),
			location: AdminConfigManager.getConfig().routes.TRANSLATIONS_OVERVIEW,
			key: 'translations',
			exact: false,
		},
	];
};
