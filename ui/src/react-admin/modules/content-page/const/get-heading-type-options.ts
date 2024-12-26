import type { SelectOption } from '@viaa/avo2-components';
import type {
	HeadingSizeOption,
	HeadingTypeOption,
} from '~modules/content-page/types/content-block.types';
import { tText } from '~shared/helpers/translation-functions';

export const GET_HEADING_TYPE_OPTIONS: () => SelectOption<HeadingTypeOption>[] = () => [
	{
		label: tText('admin/content-block/content-block___h-2'),
		value: 'h2',
	},
	{
		label: tText('admin/content-block/content-block___h-3'),
		value: 'h3',
	},
	{
		label: tText('admin/content-block/content-block___h-4'),
		value: 'h4',
	},
];

export const GET_FULL_HEADING_TYPE_OPTIONS: () => SelectOption<HeadingTypeOption>[] = () => [
	{
		label: tText('admin/content-block/content-block___h-1'),
		value: 'h1',
	},
	...GET_HEADING_TYPE_OPTIONS(),
];

export const GET_HEADING_SIZE_OPTIONS: () => SelectOption<HeadingSizeOption>[] = () => [
	{
		label: tText('Klein'),
		value: 'small',
	},
	{
		label: tText('Medium'),
		value: 'medium',
	},
	{
		label: tText('Groot'),
		value: 'large',
	},
];
