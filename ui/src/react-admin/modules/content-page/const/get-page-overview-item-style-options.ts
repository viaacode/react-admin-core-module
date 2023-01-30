import { SelectOption } from '@viaa/avo2-components';
import { ContentItemStyle } from '~content-blocks/BlockPageOverview/BlockPageOverview';
import { AdminConfigManager } from '~core/config';

export const GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS: () => SelectOption<ContentItemStyle>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___nieuws-lijst'
		),
		value: 'NEWS_LIST',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___projecten-lijst'
		),
		value: 'PROJECT_LIST',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___grid'
		),
		value: 'GRID',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___accordions'
		),
		value: 'ACCORDION',
	},
];
