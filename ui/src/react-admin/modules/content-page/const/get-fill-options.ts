import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { FillOption } from '../types/content-block.types';

export const GET_FILL_OPTIONS: () => SelectOption<FillOption>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___opvullen'
		),
		value: 'cover',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___volledig-zichtbaar'
		),
		value: 'contain',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___oorspronkelijke-grootte'
		),
		value: 'auto',
	},
];
