import type { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';
import { Color, CustomBackground, GradientColor } from '../types/content-block.types';
import { AVO } from '~shared/types';

const transparentOption = () => ({
	label: tText('admin/content-block/content-block___geen'),
	value: Color.Transparent,
});
const whiteOption = () => ({
	label: tText('admin/content-block/content-block___wit'),
	value: Color.White,
});
const gray50Option = () => ({
	label: tText('admin/content-block/content-block___grijs'),
	value: Color.Gray50,
});
const softBlueOption = () => ({
	label: tText('admin/content-block/content-block___zachtblauw', {}, [AVO]),
	value: Color.SoftBlue,
});
const nightBlueOption = () => ({
	label: tText('admin/content-block/content-block___nachtblauw', {}, [AVO]),
	value: Color.NightBlue,
});
const tealOption = () => ({
	label: tText('admin/content-block/content-block___appelblauwzeegroen', {}, [AVO]),
	value: Color.Teal,
});
const tealBrightOption = () => ({
	label: tText('admin/content-block/content-block___appelblauwzeegroen-helder', {}, [AVO]),
	value: Color.TealBright,
});
const oceanGreenOption = () => ({
	label: tText('admin/content-block/content-block___oceaangroen', {}, [AVO]),
	value: Color.OceanGreen,
});
const seaGreenOption = () => ({
	label: tText('modules/content-page/const/content-block___zeegroen'),
	value: Color.SeaGreen,
});
const yellowOption = () => ({
	label: tText('admin/content-block/content-block___leerlingen-geel', {}, [AVO]),
	value: Color.Yellow,
});
const platinumOption = () => ({
	label: tText('modules/content-page/const/content-block___platinum'),
	value: Color.Platinum,
});
const blackOption = () => ({
	label: tText('modules/content-page/const/content-block___zwart'),
	value: Color.Black,
});
const neutralOption = () => ({
	label: tText('modules/content-page/const/content-block___neutraal'),
	value: Color.Neutral,
});
const zincOption = () => ({
	label: tText('modules/content-page/const/content-block___zinc'),
	value: Color.Zinc,
});
const skyBlueOption = () => ({
	label: tText('modules/content-page/const/content-block___sky-blauw'),
	value: Color.SkyBlue,
});
const meemooLogoOption = () => ({
	label: tText('react-admin/modules/content-page/const/get-color-options___meemoo-logo'),
	value: CustomBackground.MeemooLogo,
});
const blackWhiteGradientOption = () => ({
	label: tText('modules/content-page/const/content-block___overgang-zwart-wit'),
	value: GradientColor.BlackWhite,
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

export const GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF: () => SelectOption<
	Color | GradientColor | CustomBackground
>[] = () => [
	transparentOption(),
	whiteOption(),
	oceanGreenOption(),
	seaGreenOption(),
	platinumOption(),
	blackOption(),
	skyBlueOption(),
	meemooLogoOption(),
	blackWhiteGradientOption(),
];

export const GET_AVO_HERO_BACKGROUND_COLOR_OPTIONS: () => SelectOption<Color>[] = () => [
	softBlueOption(),
	nightBlueOption(),
	tealOption(),
	tealBrightOption(),
	oceanGreenOption(),
	yellowOption(),
];

export const GET_DARK_BACKGROUND_COLOR_OPTIONS: () => (
	| Color
	| GradientColor
	| CustomBackground
)[] = () => [
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
		label: tText('admin/content-block/content-block___zwart', {}, [AVO]),
		value: Color.Black,
	},
	{
		label: tText('admin/content-block/content-block___donker-grijs', {}, [AVO]),
		value: Color.Gray700,
	},
	{
		label: tText('admin/content-block/content-block___grijs', {}, [AVO]),
		value: Color.Gray50,
	},
	{
		label: tText('admin/content-block/content-block___wit', {}, [AVO]),
		value: Color.White,
	},
];

export const GET_COLOR_OPTIONS_EXTENDED_AVO: () => SelectOption<Color>[] = () => [
	{
		label: tText('admin/content-block/content-block___zwart', {}, [AVO]),
		value: Color.Black,
	},
	{
		label: tText('admin/content-block/content-block___donker-grijs', {}, [AVO]),
		value: Color.Gray700,
	},
	{
		label: tText('admin/content-block/content-block___wit', {}, [AVO]),
		value: Color.White,
	},
	{
		label: tText('modules/content-page/const/get-color-options___teal-bright', {}, [AVO]),
		value: Color.TealBright,
	},
	{
		label: tText('modules/content-page/const/get-color-options___oceaan-groen', {}, [AVO]),
		value: Color.OceanGreen,
	},
	{
		label: tText('modules/content-page/const/get-color-options___jeneverbes', {}, [AVO]),
		value: Color.Juniper,
	},
	{
		label: tText('modules/content-page/const/get-color-options___zilver', {}, [AVO]),
		value: Color.Silver,
	},
	{
		label: tText('modules/content-page/const/get-color-options___paars-roze', {}, [AVO]),
		value: Color.Tapestry,
	},
	{
		label: tText('modules/content-page/const/get-color-options___wijn-rood', {}, [AVO]),
		value: Color.WineRed,
	},
	{
		label: tText('modules/content-page/const/get-color-options___geel', {}, [AVO]),
		value: Color.Yellow,
	},
	{
		label: tText('modules/content-page/const/get-color-options___groen', {}, [AVO]),
		value: Color.Green,
	},
	{
		label: tText('modules/content-page/const/get-color-options___donker-oranje', {}, [AVO]),
		value: Color.DarkOrange,
	},
	{
		label: tText('modules/content-page/const/get-color-options___zacht-blauw', {}, [AVO]),
		value: Color.SoftBlue,
	},
	{
		label: tText('modules/content-page/const/get-color-options___frans-roze', {}, [AVO]),
		value: Color.FrenchRose,
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
