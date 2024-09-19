import type { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';
import type { CardWithoutDescriptionStyleOption } from '../types/content-block.types';

export const GET_CARD_WITHOUT_DESCRIPTION_STYLE_OPTIONS: () => SelectOption<CardWithoutDescriptionStyleOption>[] =
	() => [
		{
			label: tText('admin/content-block/content-block___rond'),
			value: 'round',
		},
		{
			label: tText('admin/content-block/content-block___vierkant'),
			value: 'square',
		},
	];
