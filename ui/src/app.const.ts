import { AdminConfigManager } from '~core/config';
import type { NavigationItemInfo } from './shared/types';

export const GET_NAV_ITEMS = async (): Promise<NavigationItemInfo[]> => {
	const i18n = AdminConfigManager.getConfig().services.i18n;
	return [
		{
			label: i18n.tHtml('app___gebruikers'),
			location: AdminConfigManager.getAdminRoute('ADMIN_USER_OVERVIEW'),
			key: 'users',
			exact: false,
			subLinks: [
				{
					label: i18n.tHtml('app___groepen-en-permissies'),
					location: AdminConfigManager.getAdminRoute('ADMIN_USER_GROUP_OVERVIEW'),
					key: 'user-group',
					exact: false,
				},
			],
		},
		{
			label: i18n.tHtml('admin/admin___navigatie'),
			location: AdminConfigManager.getAdminRoute('ADMIN_NAVIGATION_OVERVIEW'),
			key: 'navigatie',
			exact: false,
		},
		{
			label: i18n.tHtml('admin/admin___content-paginas'),
			location: AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW'),
			key: 'content',
			exact: false,
			subLinks: [
				{
					label: i18n.tHtml('app___start-uitgelogd'),
					location: `${AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}/195`,
					key: 'pages',
					exact: true,
				},
				{
					label: i18n.tHtml('app___start-uitgelogd-leerlingen'),
					location: `${AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}/236`,
					key: 'faqs',
					exact: true,
				},
				{
					label: i18n.tHtml('app___start-uitgelogd-lesgever'),
					location: `${AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_OVERVIEW')}/313`,
					key: 'faqs',
					exact: true,
				},
			],
		},
		{
			label: i18n.tHtml('app___content-pagina-labels'),
			location: AdminConfigManager.getAdminRoute('ADMIN_CONTENT_PAGE_LABEL_OVERVIEW'),
			key: 'translations',
			exact: false,
		},
		{
			label: i18n.tHtml('app___vertalingen'),
			location: AdminConfigManager.getAdminRoute('ADMIN_TRANSLATIONS_OVERVIEW'),
			key: 'translations',
			exact: false,
		},
		{
			label: i18n.tHtml('app___meldingen'),
			location: AdminConfigManager.getAdminRoute('ADMIN_ALERTS_OVERVIEW'),
			key: 'alerts',
			exact: false,
		},
	];
};
