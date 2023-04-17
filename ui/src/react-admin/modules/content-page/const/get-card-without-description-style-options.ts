import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { CardWithoutDescriptionStyleOption } from '../types/content-block.types';

export const GET_CARD_WITHOUT_DESCRIPTION_STYLE_OPTIONS: () => SelectOption<CardWithoutDescriptionStyleOption>[] =
	() => [
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___rond'
			),
			value: 'round',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___vierkant'
			),
			value: 'square',
		},
	];
