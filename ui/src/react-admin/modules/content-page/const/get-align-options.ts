import { AdminConfigManager } from '~core/config';
import {
	AlignOption,
	BackgroundAlignOption,
} from '~modules/content-page/types/content-block.types';

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

export const GET_SIMPLE_ALIGN_OPTIONS: () => { label: string; value: AlignOption }[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___links'
		),
		value: 'left',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___rechts'
		),
		value: 'right',
	},
];

export const GET_BACKGROUND_ALIGN_OPTIONS: () => {
	label: string;
	value: BackgroundAlignOption;
}[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'react-admin/modules/content-page/const/get-align-options___linker-scherm-rand'
		),
		value: 'left-screen',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'react-admin/modules/content-page/const/get-align-options___links-binnen-de-pagina'
		),
		value: 'left-inside-page',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'react-admin/modules/content-page/const/get-align-options___rechts-binnen-de-pagina'
		),
		value: 'right-inside-page',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'react-admin/modules/content-page/const/get-align-options___rechter-scherm-rand'
		),
		value: 'right-screen',
	},
];
