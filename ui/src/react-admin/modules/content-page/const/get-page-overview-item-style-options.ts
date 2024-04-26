import { SelectOption } from '@viaa/avo2-components';
import { ContentItemStyle } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { tText } from '~shared/helpers/translation-functions';

export const GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS: () => SelectOption<ContentItemStyle>[] = () => [
	{
		label: tText('admin/content-block/content-block___nieuws-lijst'),
		value: ContentItemStyle.NEWS_LIST,
	},
	{
		label: tText('admin/content-block/content-block___projecten-lijst'),
		value: ContentItemStyle.PROJECT_LIST,
	},
	{
		label: tText('admin/content-block/content-block___grid'),
		value: ContentItemStyle.GRID,
	},
	{
		label: tText('admin/content-block/content-block___accordions'),
		value: ContentItemStyle.ACCORDION,
	},
	{
		label: tText(
			'react-admin/modules/content-page/const/get-page-overview-item-style-options___accordion-twee-niveaus'
		),
		value: ContentItemStyle.ACCORDION_TWO_LEVELS,
	},
];
