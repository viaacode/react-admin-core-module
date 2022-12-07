import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { HeadingTypeOption } from '~modules/content-page/types/content-block.types';

export const GET_HEADING_TYPE_OPTIONS: () => SelectOption<HeadingTypeOption>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___h-2'
		),
		value: 'h2',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___h-3'
		),
		value: 'h3',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___h-4'
		),
		value: 'h4',
	},
];

export const GET_FULL_HEADING_TYPE_OPTIONS: () => SelectOption<HeadingTypeOption>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___h-1'
		),
		value: 'h1',
	},
	...GET_HEADING_TYPE_OPTIONS(),
];
