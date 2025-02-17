import type { SelectOption } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { tText } from '~shared/helpers/translation-functions';
import { ContentBlockType } from '../types/content-block.types';
import { AVO, HET_ARCHIEF } from '~shared/types';

export const GET_CONTENT_BLOCK_TYPE_OPTIONS: () => SelectOption<string>[] = () => {
	const allContentBlocks: { label: string; value: ContentBlockType }[] = [
		{
			label: tText('admin/content-block/content-block___titel'),
			value: ContentBlockType.Heading,
		},
		{
			label: tText('admin/content-block/content-block___tekst'),
			value: ContentBlockType.RichText,
		},
		{
			label: tText('admin/content-block/content-block___tekst-2-kolommen'),
			value: ContentBlockType.RichTextTwoColumns,
		},
		{
			label: tText('admin/content-block/content-block___knoppen'),
			value: ContentBlockType.Buttons,
		},
		{
			label: tText('admin/content-block/content-block___intro'),
			value: ContentBlockType.Intro,
		},
		{
			label: tText('admin/content-block/content-block___2-ct-as'),
			value: ContentBlockType.CTAs,
		},
		{
			label: tText('admin/content-block/content-block___i-frame'),
			value: ContentBlockType.IFrame,
		},
		{
			label: tText('admin/content-block/content-block___klaar'),
			value: ContentBlockType.Klaar,
		},
		{
			label: tText('admin/content-block/content-block___uitgeklaard-titel-datum'),
			value: ContentBlockType.Uitgeklaard,
		},
		{
			label: tText('admin/content-block/content-block___media-tegels'),
			value: ContentBlockType.MediaGrid,
		},
		{
			label: tText('admin/content-block/content-block___media-speler'),
			value: ContentBlockType.MediaPlayer,
		},
		{
			label: tText(
				'admin/content-block/content-block___media-speler-met-titel-tekst-en-knop'
			),
			value: ContentBlockType.MediaPlayerTitleTextButton,
		},
		{
			label: tText('admin/content-block/content-block___afbeelding'),
			value: ContentBlockType.Image,
		},
		{
			label: tText('admin/content-block/content-block___afbeelding-grid'),
			value: ContentBlockType.ImageGrid,
		},
		{
			label: tText('admin/content-block/content-block___afbeelding-met-titel-tekst-en-knop'),
			value: ContentBlockType.ImageTitleTextButton,
		},
		{
			label: tText('admin/content-block/content-block___pagina-overzicht'),
			value: ContentBlockType.PageOverview,
		},
		{
			label: tText('admin/content-block/content-block___projecten-in-de-kijker'),
			value: ContentBlockType.ProjectsSpotlight,
		},
		{
			label: tText('admin/content-block/content-block___in-de-kijker'),
			value: ContentBlockType.Spotlight,
		},
		{
			label: tText('admin/content-block/content-block___quote'),
			value: ContentBlockType.Quote,
		},
		{
			label: tText('admin/content-block/helpers/generators/anchor-links___links'),
			value: ContentBlockType.AnchorLinks,
		},
		{
			label: tText('admin/content-block/content-block___hero'),
			value: ContentBlockType.AvoHero,
		},
		{
			label: tText('admin/content-block/content-block___zoek'),
			value: ContentBlockType.Search,
		},
		{
			label: tText('admin/content-block/content-block___pagina-metadata'),
			value: ContentBlockType.ContentPageMeta,
		},
		{
			label: tText('admin/content-block/content-block___logos-sign-off'),
			value: ContentBlockType.LogoGrid,
		},
		{
			label: tText('admin/content-block/content-block___usp'),
			value: ContentBlockType.UspGrid,
		},
		{
			label: tText('admin/content-block/content-block___eventbrite'),
			value: ContentBlockType.Eventbrite,
		},
		{
			label: tText('admin/content-block/content-block___tags-with-link'),
			value: ContentBlockType.TagsWithLink,
		},
		{
			label: tText('admin/content-block/content-block___three-clickable-tiles'),
			value: ContentBlockType.ThreeClickableTiles,
		},
		{
			label: tText('admin/content-block/content-block___cards_without_description'),
			value: ContentBlockType.CardsWithoutDescription,
		},
		{
			label: tText('admin/content-block/content-block___image-text-background', {}, [
				HET_ARCHIEF,
			]),
			value: ContentBlockType.HetArchiefImageTextBackground,
		},
		{
			label: tText('Afbeelding met H1 (avo)', {}, [AVO]),
			value: ContentBlockType.AvoImageTextBackground,
		},
		{
			label: tText(
				'react-admin/modules/content-page/const/get-content-block-type-options___aanbieders-grid',
				{},
				[HET_ARCHIEF]
			),
			value: ContentBlockType.MaintainersGrid,
		},
		{
			label: tText(
				'react-admin/modules/content-page/const/get-content-block-type-options___header-met-zoekveld',
				{},
				[HET_ARCHIEF]
			),
			value: ContentBlockType.HetArchiefHeaderSearch,
		},
		{
			label: tText(
				'modules/content-page/const/get-content-block-type-options___overzicht-krantentitels',
				{},
				[HET_ARCHIEF]
			),
			value: ContentBlockType.OverviewNewspaperTitles,
		},
		{
			label: tText(
				'modules/content-page/const/get-content-block-type-options___content-enclose-grid',
				{},
				[HET_ARCHIEF]
			),
			value: ContentBlockType.ContentEncloseGrid,
		},
		{
			label: tText(
				'modules/content-page/const/get-content-block-type-options___breadcrumbs',
				{},
				[HET_ARCHIEF]
			),
			value: ContentBlockType.Breadcrumbs,
		},
	];

	// Only show the content blocks that the client enabled through the config object
	return [
		{
			label: tText('admin/content-block/content-block___voeg-een-content-blok-toe'),
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
