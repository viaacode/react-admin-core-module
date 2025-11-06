import type { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions.js';
import type { WidthOption } from '../types/content-block.types.js';

export const GET_MEDIA_PLAYER_WIDTH_OPTIONS: () => SelectOption<WidthOption>[] = () => [
	{
		label: tText('admin/content-block/content-block___paginabreedte'),
		value: '100%',
	},
	{
		label: tText('admin/content-block/content-block___groot'),
		value: '700px',
	},
	{
		label: tText('admin/content-block/content-block___medium'),
		value: '500px',
	},
	{
		label: tText('admin/content-block/content-block___klein'),
		value: '400px',
	},
];

export const GET_WIDTH_OPTIONS: () => SelectOption<WidthOption>[] = () => [
	{
		label: tText('admin/content-block/content-block___schermbreedte-header'),
		value: 'page-header',
	},
	{
		label: tText('admin/content-block/content-block___schermbreedte'),
		value: 'full-width',
	},
	...GET_MEDIA_PLAYER_WIDTH_OPTIONS(),
];
