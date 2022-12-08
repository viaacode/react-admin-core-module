import { ButtonType, SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';

export const GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS: () => SelectOption<ButtonType>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___blauw'
		),
		value: 'underlined-link',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___geel'
		),
		value: 'pupil-underlined-link',
	},
];
