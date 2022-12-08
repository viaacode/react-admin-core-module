import { ContentTabStyle, SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';

export const GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS: () => SelectOption<ContentTabStyle>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___menu-balk'
		),
		value: 'MENU_BAR',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___tags'
		),
		value: 'ROUNDED_BADGES',
	},
];
