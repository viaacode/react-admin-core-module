import type { SelectOption } from '@viaa/avo2-components';
import type { ContentTabStyle } from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import { tText } from '~shared/helpers/translation-functions';

export const GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS: () => SelectOption<ContentTabStyle>[] = () => [
	{
		label: tText('admin/content-block/content-block___menu-balk'),
		value: 'MENU_BAR',
	},
	{
		label: tText('admin/content-block/content-block___tags'),
		value: 'ROUNDED_BADGES',
	},
];
