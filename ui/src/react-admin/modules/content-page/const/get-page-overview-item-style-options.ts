import { SelectOption } from '@viaa/avo2-components';
import { ContentItemStyle } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { AdminConfigManager } from '~core/config';

export const GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS: () => SelectOption<ContentItemStyle>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___nieuws-lijst'
		),
		value: ContentItemStyle.NEWS_LIST,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___projecten-lijst'
		),
		value: ContentItemStyle.PROJECT_LIST,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___grid'
		),
		value: ContentItemStyle.GRID,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___accordions'
		),
		value: ContentItemStyle.ACCORDION,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'react-admin/modules/content-page/const/get-page-overview-item-style-options___accordion-twee-niveaus'
		),
		value: ContentItemStyle.ACCORDION_TWO_LEVELS,
	},
];
