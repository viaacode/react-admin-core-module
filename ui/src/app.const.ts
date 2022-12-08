import { AdminConfigManager } from '~core/config';
import { CONTENT_PAGE_LABEL_PATH } from '~modules/content-page-labels/content-page-label.const';
import { CONTENT_PAGE_PATH } from '~modules/content-page/const/content-page.consts';
import { TRANSLATIONS_PATH } from '~modules/translations/translations.const';
import { USER_GROUP_PATH } from '~modules/user-group/const/user-group.const';
import { USER_PATH } from '~modules/user/user.routes';
import { NavigationItemInfo } from './shared/types';
import { NAVIGATION_PATH } from '~modules/navigation/navigation.consts';

export const ADMIN_PATH = () =>
	Object.freeze({
		...USER_PATH(),
		...USER_GROUP_PATH,
		...NAVIGATION_PATH(),
		CONTENT_PAGE: { ...CONTENT_PAGE_PATH() },
		...CONTENT_PAGE_LABEL_PATH,
		...TRANSLATIONS_PATH,
	});

export const GET_NAV_ITEMS = async (): Promise<NavigationItemInfo[]> => {
	const i18n = AdminConfigManager.getConfig().services.i18n;
	return [
		{
			label: i18n.tHtml('app___gebruikers'),
			location: ADMIN_PATH().USER_OVERVIEW,
			key: 'users',
			exact: false,
		},
		{
			label: i18n.tHtml('app___gebruikersgroep'),
			location: ADMIN_PATH().USER_GROUP_OVERVIEW,
			key: 'user-group',
			exact: false,
		},
		{
			label: i18n.tHtml('admin/admin___navigatie'),
			location: ADMIN_PATH().NAVIGATION_OVERVIEW,
			key: 'navigatie',
			exact: false,
		},
		{
			label: i18n.tHtml('admin/admin___content-paginas'),
			location: ADMIN_PATH().CONTENT_PAGE.OVERVIEW,
			key: 'content',
			exact: false,
			subLinks: [
				{
					label: i18n.tHtml('admin/admin___paginas'),
					location: ADMIN_PATH().CONTENT_PAGE.PAGES,
					key: 'pages',
					exact: true,
				},
				{
					label: i18n.tHtml('admin/admin___fa-qs'),
					location: ADMIN_PATH().CONTENT_PAGE.FAQS,
					key: 'faqs',
					exact: true,
				},
			],
		},
		{
			label: i18n.tHtml('Vertalingen'),
			location: ADMIN_PATH().TRANSLATIONS,
			key: 'translations',
			exact: false,
		},
	];
};
