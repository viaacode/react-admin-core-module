import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { BlockGridFormatOption } from '~modules/content-page/types/content-block.types';

export const GET_IMAGE_GRID_FORMAT_OPTIONS: () => SelectOption<BlockGridFormatOption>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___vierkant-klein-200-x-200'
		),
		value: 'squareSmall',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___vierkant-groot-275-x-275'
		),
		value: 'squareLarge',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___4-x-3-400-x-300'
		),
		value: '4:3',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___2-x-1-200-x-100'
		),
		value: '2:1',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___6-x-9-400-x-225'
		),
		value: '6:9',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___400-x-150'
		),
		value: '400x150',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___384-x-220'
		),
		value: '384x220',
	},
];
