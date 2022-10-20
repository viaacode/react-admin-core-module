import { ButtonType, ContentItemStyle, ContentTabStyle, SelectOption } from '@viaa/avo2-components';

import {
	AlignOption,
	BlockGridFormatOption,
	Color,
	FillOption,
	HeadingTypeOption,
	WidthOption,
} from '../types/content-block.types';

import { AdminConfigManager } from '~core/config';

// Options
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

export const GET_MEDIA_PLAYER_WIDTH_OPTIONS: () => SelectOption<WidthOption>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___paginabreedte'
		),
		value: '100%',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___groot'
		),
		value: '700px',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___medium'
		),
		value: '500px',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___klein'
		),
		value: '400px',
	},
];

export const GET_WIDTH_OPTIONS: () => SelectOption<WidthOption>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___schermbreedte-header'
		),
		value: 'page-header',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___schermbreedte'
		),
		value: 'full-width',
	},
	...GET_MEDIA_PLAYER_WIDTH_OPTIONS(),
];

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
];

export const GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS: () => SelectOption<ContentTabStyle>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___menu-balk'
		),
		value: 'MENU_BAR',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___tags'
		),
		value: 'ROUNDED_BADGES',
	},
];

export const GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS: () => SelectOption<ContentItemStyle>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___nieuws-lijst'
		),
		value: 'NEWS_LIST',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___projecten-lijst'
		),
		value: 'PROJECT_LIST',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___grid'
		),
		value: 'GRID',
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/content-block___accordions'
		),
		value: 'ACCORDION',
	},
];

export type PageOverviewOrderOptions =
	| 'published_at__asc'
	| 'published_at__desc'
	| 'title__asc'
	| 'title__desc';

export const GET_PAGE_OVERVIEW_ORDER_OPTIONS: () => SelectOption<PageOverviewOrderOptions>[] =
	() => [
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___publicatie-datum-nieuw-oud'
			),
			value: 'published_at__desc',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___publicatie-datum-oud-nieuw'
			),
			value: 'published_at__asc',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___titel-a-z'
			),
			value: 'title__asc',
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___titel-z-a'
			),
			value: 'title__desc',
		},
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
