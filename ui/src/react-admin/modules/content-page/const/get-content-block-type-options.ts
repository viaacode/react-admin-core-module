import { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { ContentBlockType } from '../types/content-block.types';

export const GET_CONTENT_BLOCK_TYPE_OPTIONS: () => SelectOption<string>[] = () => {
	const allContentBlocks: { label: string; value: ContentBlockType }[] = [
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___titel'
			),
			value: ContentBlockType.Heading,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___tekst'
			),
			value: ContentBlockType.RichText,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___tekst-2-kolommen'
			),
			value: ContentBlockType.RichTextTwoColumns,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___knoppen'
			),
			value: ContentBlockType.Buttons,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___intro'
			),
			value: ContentBlockType.Intro,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___2-ct-as'
			),
			value: ContentBlockType.CTAs,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___i-frame'
			),
			value: ContentBlockType.IFrame,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___klaar'
			),
			value: ContentBlockType.Klaar,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___uitgeklaard-titel-datum'
			),
			value: ContentBlockType.Uitgeklaard,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___media-tegels'
			),
			value: ContentBlockType.MediaGrid,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___media-speler'
			),
			value: ContentBlockType.MediaPlayer,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___media-speler-met-titel-tekst-en-knop'
			),
			value: ContentBlockType.MediaPlayerTitleTextButton,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___afbeelding'
			),
			value: ContentBlockType.Image,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___afbeelding-grid'
			),
			value: ContentBlockType.ImageGrid,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___afbeelding-met-titel-tekst-en-knop'
			),
			value: ContentBlockType.ImageTitleTextButton,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___pagina-overzicht'
			),
			value: ContentBlockType.PageOverview,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___projecten-in-de-kijker'
			),
			value: ContentBlockType.ProjectsSpotlight,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___in-de-kijker'
			),
			value: ContentBlockType.Spotlight,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___quote'
			),
			value: ContentBlockType.Quote,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/helpers/generators/anchor-links___links'
			),
			value: ContentBlockType.AnchorLinks,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___hero'
			),
			value: ContentBlockType.Hero,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___zoek'
			),
			value: ContentBlockType.Search,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___pagina-metadata'
			),
			value: ContentBlockType.ContentPageMeta,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___logos-sign-off'
			),
			value: ContentBlockType.LogoGrid,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___usp'
			),
			value: ContentBlockType.UspGrid,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___eventbrite'
			),
			value: ContentBlockType.Eventbrite,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___tags-with-link'
			),
			value: ContentBlockType.TagsWithLink,
		},
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___three-clickable-tiles'
			),
			value: ContentBlockType.ThreeClickableTiles,
		},
	];

	// Only show the content blocks that the client enabled through the config object
	return [
		{
			label: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/content-block/content-block___voeg-een-content-blok-toe'
			),
			value: '',
			disabled: true,
		},
		...allContentBlocks.filter((contentBlock) => {
			return AdminConfigManager.getConfig()?.contentPage?.availableContentBlocks?.includes(
				contentBlock.value
			);
		}),
	];
};
