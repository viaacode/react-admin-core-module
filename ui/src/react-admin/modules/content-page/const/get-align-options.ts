import { AdminConfigManager } from '~core/config';
import { AlignOption } from '~modules/content-page/types/content-block.types';

export const GET_ALIGN_OPTIONS: () => { label: string; value: AlignOption }[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___links'
		),
		value: 'left',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___gecentreerd'
		),
		value: 'center',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___rechts'
		),
		value: 'right',
	},
];
