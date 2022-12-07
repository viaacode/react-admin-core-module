import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { Color } from '../types/content-block.types';

const transparentOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___geen'
	),
	value: Color.Transparent,
});
const whiteOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___wit'
	),
	value: Color.White,
});
const gray50Option = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___grijs'
	),
	value: Color.Gray50,
});
const softBlueOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___zachtblauw'
	),
	value: Color.SoftBlue,
});
const nightBlueOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___nachtblauw'
	),
	value: Color.NightBlue,
});
const tealOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___appelblauwzeegroen'
	),
	value: Color.Teal,
});
const tealBrightOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___appelblauwzeegroen-helder'
	),
	value: Color.TealBright,
});
const oceanGreenOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___oceaangroen'
	),
	value: Color.OceanGreen,
});
const seaGreenOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'modules/content-page/const/content-block___zeegroen'
	),
	value: Color.SeaGreen,
});
const yellowOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/content-block___leerlingen-geel'
	),
	value: Color.Yellow,
});
const platinumOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'modules/content-page/const/content-block___platinum'
	),
	value: Color.Platinum,
});
const blackOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'modules/content-page/const/content-block___zwart'
	),
	value: Color.Black,
});
const neutralOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'modules/content-page/const/content-block___neutraal'
	),
	value: Color.Neutral,
});
const zincOption = () => ({
	label: AdminConfigManager.getConfig().services.i18n.tText(
		'modules/content-page/const/content-block___zinc'
	),
	value: Color.Zinc,
});

//
export const GET_BACKGROUND_COLOR_OPTIONS_AVO: () => SelectOption<Color>[] = () => [
	transparentOption(),
	whiteOption(),
	gray50Option(),
	softBlueOption(),
	nightBlueOption(),
	tealOption(),
	tealBrightOption(),
	oceanGreenOption(),
	yellowOption(),
];

export const GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF: () => SelectOption<Color>[] = () => [
	transparentOption(),
	whiteOption(),
	oceanGreenOption(),
	seaGreenOption(),
	platinumOption(),
	blackOption(),
];

export const GET_HERO_BACKGROUND_COLOR_OPTIONS: () => SelectOption<Color>[] = () => [
	softBlueOption(),
	nightBlueOption(),
	tealOption(),
	tealBrightOption(),
	oceanGreenOption(),
	yellowOption(),
];

export const GET_DARK_BACKGROUND_COLOR_OPTIONS: () => Color[] = () => [
	Color.SoftBlue,
	Color.NightBlue,
	Color.Teal,
	Color.TealBright,
	Color.OceanGreen,
	Color.SeaGreen,
	Color.Yellow,
	Color.Black,
];

export const GET_FOREGROUND_COLOR_OPTIONS_AVO: () => SelectOption<Color>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___zwart'
		),
		value: Color.Black,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___donker-grijs'
		),
		value: Color.Gray700,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___grijs'
		),
		value: Color.Gray50,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___wit'
		),
		value: Color.White,
	},
];

export const GET_FOREGROUND_COLOR_OPTIONS_ARCHIEF: () => SelectOption<Color>[] = () => [
	blackOption(),
	whiteOption(),
	neutralOption(),
	zincOption(),
	oceanGreenOption(),
	seaGreenOption(),
];
