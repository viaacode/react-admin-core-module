import { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';
import { FillOption } from '../types/content-block.types';

export const GET_FILL_OPTIONS: () => SelectOption<FillOption>[] = () => [
	{
		label: tText('admin/content-block/content-block___opvullen'),
		value: 'cover',
	},
	{
		label: tText('admin/content-block/content-block___volledig-zichtbaar'),
		value: 'contain',
	},
	{
		label: tText('admin/content-block/content-block___oorspronkelijke-grootte'),
		value: 'auto',
	},
];
