import {
	Checkbox,
	DatePicker,
	MultiRange,
	Select,
	SelectOption,
	TextArea,
	TextInput,
} from '@viaa/avo2-components';
import { FunctionComponent } from 'react';

import { ContentPicker } from '../../shared/components/ContentPicker/ContentPicker';
import { ContentTypeAndLabelsPicker } from '../../shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker';
import { UserGroupSelect } from '../../shared/components/UserGroupSelect/UserGroupSelect';
import RichTextEditorWrapper from '../../shared/components/RichTextEditorWrapper/RichTextEditorWrapper';
import { AlignSelect, ColorSelect, PaddingSelect } from '../components/fields';
import {
	ANCHOR_LINKS_BLOCK_CONFIG,
	INITIAL_ANCHOR_LINKS_COMPONENTS_STATE,
} from '../components/blocks/anchor-links';
import {
	BUTTONS_BLOCK_CONFIG,
	INITIAL_BUTTONS_COMPONENTS_STATE,
} from '../components/blocks/buttons';
import {
	CONTENT_PAGE_META_BLOCK_CONFIG,
	INITIAL_CONTENT_PAGE_META_COMPONENTS_STATE,
} from '../components/blocks/content-page-meta';
import { CTAS_BLOCK_CONFIG, INITIAL_CTAS_COMPONENTS_STATE } from '../components/blocks/ctas';
import {
	EVENTBRITE_BLOCK_CONFIG,
	INITIAL_EVENTBRITE_COMPONENTS_STATE,
} from '../components/blocks/eventbrite';
import {
	HEADING_BLOCK_CONFIG,
	INITIAL_HEADING_COMPONENTS_STATE,
} from '../components/blocks/heading';
import { HERO_BLOCK_CONFIG, INITIAL_HERO_COMPONENTS_STATE } from '../components/blocks/hero';
import { IFRAME_BLOCK_CONFIG, INITIAL_IFRAME_COMPONENTS_STATE } from '../components/blocks/iframe';
import { IMAGE_BLOCK_CONFIG, INITIAL_IMAGE_COMPONENTS_STATE } from '../components/blocks/image';
import {
	IMAGE_GRID_BLOCK_CONFIG,
	INITIAL_IMAGE_GRID_COMPONENTS_STATE,
} from '../components/blocks/image-grid';
import { INITIAL_INTRO_COMPONENTS_STATE, INTRO_BLOCK_CONFIG } from '../components/blocks/intro';
import { INITIAL_KLAAR_COMPONENTS_STATE, KLAAR_BLOCK_CONFIG } from '../components/blocks/klaar';
import {
	INITIAL_LOGO_GRID_COMPONENTS_STATE,
	LOGO_GRID_BLOCK_CONFIG,
} from '../components/blocks/logo-grid';
import {
	INITIAL_MEDIA_GRID_COMPONENTS_STATE,
	MEDIA_GRID_BLOCK_CONFIG,
} from '../components/blocks/media-grid';
import {
	INITIAL_MEDIA_PLAYER_COMPONENTS_STATE,
	MEDIA_PLAYER_BLOCK_CONFIG,
} from '../components/blocks/media-player';
import {
	INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE,
	MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_CONFIG,
} from '../components/blocks/media-player-title-text-button';
import {
	INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE,
	PAGE_OVERVIEW_BLOCK_CONFIG,
} from '../components/blocks/page-overview';
import {
	INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE,
	PROJECTS_SPOTLIGHT_BLOCK_CONFIG,
} from '../components/blocks/project-spotlight';
import { INITIAL_QUOTE_COMPONENTS_STATE, QUOTE_BLOCK_CONFIG } from '../components/blocks/quote';
import {
	INITIAL_RICH_TEXT_COMPONENTS_STATE,
	RICH_TEXT_BLOCK_CONFIG,
} from '../components/blocks/rich-text';
import {
	INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE,
	RICH_TEXT_TWO_COLUMNS_BLOCK_CONFIG,
} from '../components/blocks/rich-text-two-columns';
import { INITIAL_SEARCH_COMPONENTS_STATE, SEARCH_BLOCK_CONFIG } from '../components/blocks/search';
import {
	INITIAL_SPOTLIGHT_COMPONENTS_STATE,
	SPOTLIGHT_BLOCK_CONFIG,
} from '../components/blocks/spotlight';
import {
	INITIAL_USP_GRID_COMPONENTS_STATE,
	USP_GRID_BLOCK_CONFIG,
} from '../components/blocks/usp-grid';
import {
	ContentBlockComponentState,
	ContentBlockConfig,
	ContentBlockType,
} from '../types/content-block.types';

import { Config } from '~core/config';
import FileUpload from '~modules/shared/components/FileUpload/FileUpload';
import { IconPicker } from '~modules/shared/components/IconPicker/IconPicker';

// TODO investigate why these cannot be loaded from the barrel file: src/admin/shared/components/index.ts
// More info on the bug that occurs:
// https://github.com/viaacode/avo2-client/commit/7112c51cc1a84d482b5f67b21326784be8df42f3

export const GET_CONTENT_BLOCK_TYPE_OPTIONS: () => SelectOption<string>[] = () => {
	const allContentBlocks: { label: string; value: ContentBlockType }[] = [
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___titel'),
			value: ContentBlockType.Heading,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___tekst'),
			value: ContentBlockType.RichText,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___tekst-2-kolommen'
			),
			value: ContentBlockType.RichTextTwoColumns,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___knoppen'
			),
			value: ContentBlockType.Buttons,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___intro'),
			value: ContentBlockType.Intro,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___2-ct-as'
			),
			value: ContentBlockType.CTAs,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___i-frame'
			),
			value: ContentBlockType.IFrame,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___klaar'),
			value: ContentBlockType.Klaar,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___media-tegels'
			),
			value: ContentBlockType.MediaGrid,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___media-speler'
			),
			value: ContentBlockType.MediaPlayer,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___media-speler-met-titel-tekst-en-knop'
			),
			value: ContentBlockType.MediaPlayerTitleTextButton,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___afbeelding'
			),
			value: ContentBlockType.Image,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___afbeelding-grid'
			),
			value: ContentBlockType.ImageGrid,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___pagina-overzicht'
			),
			value: ContentBlockType.PageOverview,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___projecten-in-de-kijker'
			),
			value: ContentBlockType.ProjectsSpotlight,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___in-de-kijker'
			),
			value: ContentBlockType.Spotlight,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___quote'),
			value: ContentBlockType.Quote,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/helpers/generators/anchor-links___links'
			),
			value: ContentBlockType.AnchorLinks,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___hero'),
			value: ContentBlockType.Hero,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___zoek'),
			value: ContentBlockType.Search,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___pagina-metadata'
			),
			value: ContentBlockType.ContentPageMeta,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___logos-sign-off'
			),
			value: ContentBlockType.LogoGrid,
		},
		{
			label: Config.getConfig().services.i18n.t('admin/content-block/content-block___usp'),
			value: ContentBlockType.UspGrid,
		},
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___eventbrite'
			),
			value: ContentBlockType.Eventbrite,
		},
	];

	// Only show the content blocks that the client enabled through the config object
	return [
		{
			label: Config.getConfig().services.i18n.t(
				'admin/content-block/content-block___voeg-een-content-blok-toe'
			),
			value: '',
			disabled: true,
		},
		...allContentBlocks.filter((contentBlock) => {
			return Config.getConfig()?.contentPage?.availableContentBlocks?.includes(
				contentBlock.value
			);
		}),
	];
};

export const GET_EDITOR_TYPES_MAP = (): Record<string, FunctionComponent<any>> => ({
	AlignSelect,
	Checkbox,
	ColorSelect,
	ContentPicker,
	ContentTypeAndLabelsPicker,
	DatePicker,
	FileUpload,
	IconPicker,
	MultiRange,
	PaddingSelect,
	Select,
	TextArea,
	TextInput,
	UserGroupSelect,
	RICH_TEXT_EDITOR: RichTextEditorWrapper,
});

export const CONTENT_BLOCK_CONFIG_MAP: Record<
	ContentBlockType,
	(position?: number) => ContentBlockConfig
> = {
	[ContentBlockType.AnchorLinks]: ANCHOR_LINKS_BLOCK_CONFIG,
	[ContentBlockType.Buttons]: BUTTONS_BLOCK_CONFIG,
	[ContentBlockType.CTAs]: CTAS_BLOCK_CONFIG,
	[ContentBlockType.Heading]: HEADING_BLOCK_CONFIG,
	[ContentBlockType.Hero]: HERO_BLOCK_CONFIG,
	[ContentBlockType.IFrame]: IFRAME_BLOCK_CONFIG,
	[ContentBlockType.Image]: IMAGE_BLOCK_CONFIG,
	[ContentBlockType.ImageGrid]: IMAGE_GRID_BLOCK_CONFIG,
	[ContentBlockType.Intro]: INTRO_BLOCK_CONFIG,
	[ContentBlockType.Klaar]: KLAAR_BLOCK_CONFIG,
	[ContentBlockType.MediaGrid]: MEDIA_GRID_BLOCK_CONFIG,
	[ContentBlockType.MediaPlayer]: MEDIA_PLAYER_BLOCK_CONFIG,
	[ContentBlockType.MediaPlayerTitleTextButton]: MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_CONFIG,
	[ContentBlockType.Quote]: QUOTE_BLOCK_CONFIG,
	[ContentBlockType.PageOverview]: PAGE_OVERVIEW_BLOCK_CONFIG,
	[ContentBlockType.ProjectsSpotlight]: PROJECTS_SPOTLIGHT_BLOCK_CONFIG,
	[ContentBlockType.Spotlight]: SPOTLIGHT_BLOCK_CONFIG,
	[ContentBlockType.RichText]: RICH_TEXT_BLOCK_CONFIG,
	[ContentBlockType.RichTextTwoColumns]: RICH_TEXT_TWO_COLUMNS_BLOCK_CONFIG,
	[ContentBlockType.Search]: SEARCH_BLOCK_CONFIG,
	[ContentBlockType.ContentPageMeta]: CONTENT_PAGE_META_BLOCK_CONFIG,
	[ContentBlockType.LogoGrid]: LOGO_GRID_BLOCK_CONFIG,
	[ContentBlockType.UspGrid]: USP_GRID_BLOCK_CONFIG,
	[ContentBlockType.Eventbrite]: EVENTBRITE_BLOCK_CONFIG,
};

export const CONTENT_BLOCK_INITIAL_STATE_MAP: {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	[type in ContentBlockType]: (position?: number) => ContentBlockComponentState;
	/* eslint-enable @typescript-eslint/no-unused-vars */
} = {
	[ContentBlockType.AnchorLinks]: INITIAL_ANCHOR_LINKS_COMPONENTS_STATE,
	[ContentBlockType.Buttons]: INITIAL_BUTTONS_COMPONENTS_STATE,
	[ContentBlockType.CTAs]: INITIAL_CTAS_COMPONENTS_STATE,
	[ContentBlockType.Heading]: INITIAL_HEADING_COMPONENTS_STATE,
	[ContentBlockType.Hero]: INITIAL_HERO_COMPONENTS_STATE,
	[ContentBlockType.IFrame]: INITIAL_IFRAME_COMPONENTS_STATE,
	[ContentBlockType.Image]: INITIAL_IMAGE_COMPONENTS_STATE,
	[ContentBlockType.ImageGrid]: INITIAL_IMAGE_GRID_COMPONENTS_STATE,
	[ContentBlockType.Intro]: INITIAL_INTRO_COMPONENTS_STATE,
	[ContentBlockType.Klaar]: INITIAL_KLAAR_COMPONENTS_STATE,
	[ContentBlockType.MediaGrid]: INITIAL_MEDIA_GRID_COMPONENTS_STATE,
	[ContentBlockType.MediaPlayer]: INITIAL_MEDIA_PLAYER_COMPONENTS_STATE,
	[ContentBlockType.MediaPlayerTitleTextButton]:
		INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE,
	[ContentBlockType.PageOverview]: INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE,
	[ContentBlockType.ProjectsSpotlight]: INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE,
	[ContentBlockType.Spotlight]: INITIAL_SPOTLIGHT_COMPONENTS_STATE,
	[ContentBlockType.Quote]: INITIAL_QUOTE_COMPONENTS_STATE,
	[ContentBlockType.RichText]: INITIAL_RICH_TEXT_COMPONENTS_STATE,
	[ContentBlockType.RichTextTwoColumns]: INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE,
	[ContentBlockType.Search]: INITIAL_SEARCH_COMPONENTS_STATE,
	[ContentBlockType.ContentPageMeta]: INITIAL_CONTENT_PAGE_META_COMPONENTS_STATE,
	[ContentBlockType.LogoGrid]: INITIAL_LOGO_GRID_COMPONENTS_STATE,
	[ContentBlockType.UspGrid]: INITIAL_USP_GRID_COMPONENTS_STATE,
	[ContentBlockType.Eventbrite]: INITIAL_EVENTBRITE_COMPONENTS_STATE,
};
