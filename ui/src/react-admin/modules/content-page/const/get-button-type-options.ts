import { ButtonType, SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';

export const GET_BUTTON_TYPE_OPTIONS: () => SelectOption<ButtonType>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___primair'
		),
		value: 'primary',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___secundair'
		),
		value: 'secondary',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___secundair-invers'
		),
		value: 'underlined-link',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___tertiair'
		),
		value: 'tertiary',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___randloos'
		),
		value: 'borderless',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___randloos-invers'
		),
		value: 'pupil-underlined-link',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___gevaar'
		),
		value: 'danger',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___gevaar-hover'
		),
		value: 'danger-hover',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___link'
		),
		value: 'link',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___link-inline'
		),
		value: 'inline-link',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___leerling-primair-geel'
		),
		value: 'pupil-primary',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___leerling-link-tekst-in-geel'
		),
		value: 'pupil-link',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___leerling-link-geel-inline'
		),
		value: 'pupil-inline-link',
	},
];
