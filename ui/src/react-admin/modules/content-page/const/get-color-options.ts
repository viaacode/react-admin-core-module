import type { SelectOption } from '@viaa/avo2-components';
import { tText } from '~shared/helpers/translation-functions';
import { AVO } from '~shared/types';
import { App } from '../../../../../scripts/translation.types';
import { Color, CustomBackground, GradientColor } from '../types/content-block.types';

const transparentOption = () => ({
	label: tText('admin/content-block/content-block___geen'),
	value: Color.Transparent,
});
const whiteOption = () => ({
	label: tText('admin/content-block/content-block___wit'),
	value: Color.White,
});
const gray50Option = () => ({
	label: tText('admin/content-block/content-block___grijs', {}, [App.AVO]),
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
	label: tText('modules/content-page/const/content-block___platinum', {}, [App.HET_ARCHIEF]),
	value: Color.Platinum,
});
const blackOption = () => ({
	label: tText('modules/content-page/const/content-block___zwart'),
	value: Color.Black,
});
const neutralOption = () => ({
	label: tText('modules/content-page/const/content-block___neutraal', {}, [App.HET_ARCHIEF]),
	value: Color.Neutral,
});
const zincOption = () => ({
	label: tText('modules/content-page/const/content-block___zinc', {}, [App.HET_ARCHIEF]),
	value: Color.Zinc,
});
const skyBlueOption = () => ({
	label: tText('modules/content-page/const/content-block___sky-blauw', {}, [App.HET_ARCHIEF]),
	value: Color.SkyBlue,
});
const meemooLogoOption = () => ({
	label: tText('react-admin/modules/content-page/const/get-color-options___meemoo-logo', {}, [
		App.HET_ARCHIEF,
	]),
	value: CustomBackground.MeemooLogo,
});
const blackWhiteGradientOption = () => ({
	label: tText('modules/content-page/const/content-block___overgang-zwart-wit', {}, [
		App.HET_ARCHIEF,
	]),
	value: GradientColor.BlackWhite,
});
const oldPinkOption = () => ({
	label: tText('modules/content-page/const/content-block___oud-roze', {}, [App.HET_ARCHIEF]),
	value: Color.OldPink,
});
const lavenderOption = () => ({
	label: tText('modules/content-page/const/content-block___lavendel', {}, [App.HET_ARCHIEF]),
	value: Color.Lavender,
});
const lilaOption = () => ({
	label: tText('modules/content-page/const/content-block___lila', {}, [App.HET_ARCHIEF]),
	value: Color.Lila,
});
const blossomPinkOption = () => ({
	label: tText('modules/content-page/const/content-block___bloesem-roze', {}, [App.HET_ARCHIEF]),
	value: Color.BlossomPink,
});
const coralOption = () => ({
	label: tText('modules/content-page/const/content-block___koraal-oranje', {}, [App.HET_ARCHIEF]),
	value: Color.Coral,
});
const lightBlueOption = () => ({
	label: tText('modules/content-page/const/content-block___poederblauw', {}, [App.HET_ARCHIEF]),
	value: Color.LightBlue,
});
const sageOption = () => ({
	label: tText('modules/content-page/const/content-block___salie-groen', {}, [App.HET_ARCHIEF]),
	value: Color.Sage,
});
const pistachioOption = () => ({
	label: tText('modules/content-page/const/content-block___pistache-groen', {}, [App.HET_ARCHIEF]),
	value: Color.Pistachio,
});
const sandBeigeOption = () => ({
	label: tText('modules/content-page/const/content-block___zand-beige', {}, [App.HET_ARCHIEF]),
	value: Color.SandBeige,
});
const mustardOption = () => ({
	label: tText('modules/content-page/const/content-block___honing-geel', {}, [App.HET_ARCHIEF]),
	value: Color.Mustard,
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
	oldPinkOption(),
	lavenderOption(),
	lilaOption(),
	blossomPinkOption(),
	coralOption(),
	lightBlueOption(),
	sageOption(),
	pistachioOption(),
	sandBeigeOption(),
	mustardOption(),
];

/**
 * The label background colours that get white text instead of black, following the rule meemoo set:
 * black text on the colour, unless white text on that colour passes WCAG AA. Of the archief
 * background colours only these two clear 4.5:1 against white: black (21:1) and old pink (4.87:1,
 * the "Pareltjes" label). The chip text is 1.6rem/700, so the 3:1 large text threshold does not
 * apply. https://meemoo.atlassian.net/browse/ARC-3818
 *
 * Deliberately not GET_DARK_BACKGROUND_COLOR_OPTIONS: that list predates the rule and would put
 * white on e.g. ocean green, which only reaches 2.13:1.
 */
export const CONTENT_PAGE_LABEL_COLORS_WITH_WHITE_TEXT: string[] = [Color.Black, Color.OldPink];

export const GET_AVO_HERO_BACKGROUND_COLOR_OPTIONS: () => SelectOption<Color>[] = () => [
	softBlueOption(),
	nightBlueOption(),
	tealOption(),
	tealBrightOption(),
	oceanGreenOption(),
	yellowOption(),
];

export const GET_DARK_BACKGROUND_COLOR_OPTIONS: () => (Color | GradientColor | CustomBackground)[] =
	() => [
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
	transparentOption(),
	blackOption(),
	{
		label: tText('admin/content-block/content-block___donker-grijs', {}, [AVO]),
		value: Color.Gray700,
	},
	whiteOption(),
	tealBrightOption(),
	oceanGreenOption(),
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
	yellowOption(),
	{
		label: tText('modules/content-page/const/get-color-options___groen', {}, [AVO]),
		value: Color.Green,
	},
	{
		label: tText('modules/content-page/const/get-color-options___donker-oranje', {}, [AVO]),
		value: Color.DarkOrange,
	},
	softBlueOption(),
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
