import { ButtonType, ContentItemStyle, ContentTabStyle, SelectOption } from '@viaa/avo2-components';

import {
	AlignOption,
	BlockGridFormatOption,
	Color,
	FillOption,
	HeadingTypeOption,
	WidthOption,
} from '../types/content-block.types';

import { Config } from '~core/config';

export const CONTENT_BLOCKS_RESULT_PATH: Record<string, [string, string]> = {
	GET: ['data.app_content_blocks', 'data.app_content_block'],
	INSERT: ['data.insert_app_content_blocks', 'data.insert_app_content_block'],
};

// Options
const transparentOption = () => ({
	label: Config.getConfig().services.i18n.t('admin/content-block/content-block___geen'),
	value: Color.Transparent,
});
const whiteOption = () => ({
	label: Config.getConfig().services.i18n.t('admin/content-block/content-block___wit'),
	value: Color.White,
});
const gray50Option = () => ({
	label: Config.getConfig().services.i18n.t('admin/content-block/content-block___grijs'),
	value: Color.Gray50,
});
const softBlueOption = () => ({
	label: Config.getConfig().services.i18n.t('admin/content-block/content-block___zachtblauw'),
	value: Color.SoftBlue,
});
const nightBlueOption = () => ({
	label: Config.getConfig().services.i18n.t('admin/content-block/content-block___nachtblauw'),
	value: Color.NightBlue,
});
const tealOption = () => ({
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/content-block___appelblauwzeegroen'
	),
	value: Color.Teal,
});
const tealBrightOption = () => ({
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/content-block___appelblauwzeegroen-helder'
	),
	value: Color.TealBright,
});
const oceanGreenOption = () => ({
	label: Config.getConfig().services.i18n.t('admin/content-block/content-block___oceaangroen'),
	value: Color.OceanGreen,
});
const seaGreenOption = () => ({
	label: Config.getConfig().services.i18n.t(
		'modules/content-page/const/content-block___zeegroen'
	),
	value: Color.SeaGreen,
});
const yellowOption = () => ({
	label: Config.getConfig().services.i18n.t(
		'admin/content-block/content-block___leerlingen-geel'
	),
	value: Color.Yellow,
});
const platinumOption = () => ({
	label: Config.getConfig().services.i18n.t(
		'modules/content-page/const/content-block___platinum'
	),
	value: Color.Platinum,
});
const blackOption = () => ({
	label: Config.getConfig().services.i18n.t('modules/content-page/const/content-block___zwart'),
	value: Color.Black,
});
const neutralOption = () => ({
	label: Config.getConfig().services.i18n.t(
		'modules/content-page/const/content-block___neutraal'
	),
	value: Color.Neutral,
});
const zincOption = () => ({
	label: Config.getConfig().services.i18n.t('modules/content-page/const/content-block___zinc'),
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
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___h-2'),
		value: 'h2',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___h-3'),
		value: 'h3',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___h-4'),
		value: 'h4',
	},
];

export const GET_FULL_HEADING_TYPE_OPTIONS: () => SelectOption<HeadingTypeOption>[] = () => [
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___h-1'),
		value: 'h1',
	},
	...GET_HEADING_TYPE_OPTIONS(),
];

export const GET_MEDIA_PLAYER_WIDTH_OPTIONS: () => SelectOption<WidthOption>[] = () => [
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___paginabreedte'
		),
		value: '100%',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___groot'),
		value: '700px',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___medium'),
		value: '500px',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___klein'),
		value: '400px',
	},
];

export const GET_WIDTH_OPTIONS: () => SelectOption<WidthOption>[] = () => [
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___schermbreedte-header'
		),
		value: 'page-header',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___schermbreedte'
		),
		value: 'full-width',
	},
	...GET_MEDIA_PLAYER_WIDTH_OPTIONS(),
];

export const GET_FILL_OPTIONS: () => SelectOption<FillOption>[] = () => [
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___opvullen'),
		value: 'cover',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___volledig-zichtbaar'
		),
		value: 'contain',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___oorspronkelijke-grootte'
		),
		value: 'auto',
	},
];

export const GET_IMAGE_GRID_FORMAT_OPTIONS: () => SelectOption<BlockGridFormatOption>[] = () => [
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___vierkant-klein-200-x-200'
		),
		value: 'squareSmall',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___vierkant-groot-275-x-275'
		),
		value: 'squareLarge',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___4-x-3-400-x-300'
		),
		value: '4:3',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___2-x-1-200-x-100'
		),
		value: '2:1',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___6-x-9-400-x-225'
		),
		value: '6:9',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___400-x-150'),
		value: '400x150',
	},
];

export const GET_PAGE_OVERVIEW_TAB_STYLE_OPTIONS: () => SelectOption<ContentTabStyle>[] = () => [
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___menu-balk'),
		value: 'MENU_BAR',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___tags'),
		value: 'ROUNDED_BADGES',
	},
];

export const GET_PAGE_OVERVIEW_ITEM_STYLE_OPTIONS: () => SelectOption<ContentItemStyle>[] = () => [
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___nieuws-lijst'
		),
		value: 'NEWS_LIST',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___projecten-lijst'
		),
		value: 'PROJECT_LIST',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___grid'),
		value: 'GRID',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___accordions'),
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
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___publicatie-datum-nieuw-oud'
			),
			value: 'published_at__desc',
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___publicatie-datum-oud-nieuw'
			),
			value: 'published_at__asc',
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___titel-a-z'
			),
			value: 'title__asc',
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___titel-z-a'
			),
			value: 'title__desc',
		},
	];

export const GET_FOREGROUND_COLOR_OPTIONS_AVO: () => SelectOption<Color>[] = () => [
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___zwart'),
		value: Color.Black,
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___donker-grijs'
		),
		value: Color.Gray700,
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___grijs'),
		value: Color.Gray50,
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___wit'),
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
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___links'),
		value: 'left',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___gecentreerd'
		),
		value: 'center',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___rechts'),
		value: 'right',
	},
];

export const GET_UNDERLINED_LINK_BUTTON_TYPE_OPTIONS: () => SelectOption<ButtonType>[] = () => [
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___blauw'),
		value: 'underlined-link',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___geel'),
		value: 'pupil-underlined-link',
	},
];

export const GET_BUTTON_TYPE_OPTIONS: () => SelectOption<ButtonType>[] = () => [
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___primair'),
		value: 'primary',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___secundair'),
		value: 'secondary',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___secundair-invers'
		),
		value: 'secondary-i',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___tertiair'),
		value: 'tertiary',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___randloos'),
		value: 'borderless',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___randloos-invers'
		),
		value: 'borderless-i',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___gevaar'),
		value: 'danger',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___gevaar-hover'
		),
		value: 'danger-hover',
	},
	{
		label: Config.getConfig().services.i18n.t('admin/content-block/content-block___link'),
		value: 'link',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___link-inline'
		),
		value: 'inline-link',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___leerling-primair-geel'
		),
		value: 'pupil-primary',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___leerling-link-tekst-in-geel'
		),
		value: 'pupil-link',
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/content-block/content-block___leerling-link-geel-inline'
		),
		value: 'pupil-inline-link',
	},
];
