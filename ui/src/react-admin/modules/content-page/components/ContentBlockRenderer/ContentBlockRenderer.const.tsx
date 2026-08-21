import type { FC, FunctionComponent } from 'react';
import { AvoHeroWrapper } from '~content-blocks/BlockAvoHero/AvoHeroWrapper';
import { BlockAvoImageTextBackground } from '~content-blocks/BlockAvoImageTextBackground';
import { BlockAvoQuote } from '~content-blocks/BlockAvoQuote';
import { BlockBreadcrumbs } from '~content-blocks/BlockBreadcrumbs';
import { BlockButtonsWrapper } from '~content-blocks/BlockButtons';
import { BlockCardsWithoutDescription } from '~content-blocks/BlockCardsWithoutDescription';
import { BlockContentPageMeta } from '~content-blocks/BlockContentPageMeta';
import { BlockCTAsWrapper } from '~content-blocks/BlockCTAs';
import { BlockDoubleBanner } from '~content-blocks/BlockDoubleBanner';
import { BlockEventbrite } from '~content-blocks/BlockEventbrite';
import { BlockHeading } from '~content-blocks/BlockHeading';
import { BlockHeroCarousel } from '~content-blocks/BlockHeroCarousel';
import { BlockHetArchiefHeaderSearch } from '~content-blocks/BlockHetArchiefHeaderSearch/BlockHetArchiefHeaderSearch';
import { BlockHetArchiefImageTextBackground } from '~content-blocks/BlockHetArchiefImageTextBackground';
import { BlockHetArchiefQuote } from '~content-blocks/BlockHetArchiefQuote';
import { BlockHetArchiefVideo } from '~content-blocks/BlockHetArchiefVideo';
import { BlockHighlightText } from '~content-blocks/BlockHighlightText';
import { BlockHomepageBanner } from '~content-blocks/BlockHomepageBanner';
import { BlockIFrame } from '~content-blocks/BlockIFrame';
import { BlockImage } from '~content-blocks/BlockImage';
import { BlockImageCarousel } from '~content-blocks/BlockImageCarousel';
import {
	BlockImageGridWrapper,
	BlockLogoGridWrapper,
	BlockUspGridWrapper,
} from '~content-blocks/BlockImageGrid';
import { BlockImageTitleTextButtonWrapper } from '~content-blocks/BlockImageTitleTextButton';
import { BlockIntro } from '~content-blocks/BlockIntro';
import { BlockKlaar } from '~content-blocks/BlockKlaar';
import { BlockMaintainersGrid } from '~content-blocks/BlockMaintainersGrid';
import { BlockObjectsGrid } from '~content-blocks/BlockObjectsGrid';
import { BlockOverviewNewspaperTitles } from '~content-blocks/BlockOverviewNewspaperTitles';
import { BlockOverviewThemes } from '~content-blocks/BlockOverviewThemes/BlockOverviewThemes.tsx';
import { BlockOverviewWithCarousel } from '~content-blocks/BlockOverviewWithCarousel/BlockOverviewWithCarousel.tsx';
import { BlockPageOverviewWrapper } from '~content-blocks/BlockPageOverview';
import { BlockRichTextWrapper } from '~content-blocks/BlockRichText';
import { BlockScrollDownNudge } from '~content-blocks/BlockScrollDownNudge';
import { BlockProjectSpotlightWrapper, BlockSpotlight } from '~content-blocks/BlockSpotlight';
import { BlockTagsWithLink } from '~content-blocks/BlockTagsWithLink';
import { BlockThemeReels } from '~content-blocks/BlockThemeReels';
import { BlockThreeClickableTiles } from '~content-blocks/BlockThreeClickableTiles';
import { BlockTimeline } from '~content-blocks/BlockTimeline';
import { BlockTitleWithParallax } from '~content-blocks/BlockTitleWithParallax';
import { BlockUitgeklaard } from '~content-blocks/BlockUitgeklaard';
import { BlockVideoWrapper } from '~content-blocks/BlockVideo';
import { BlockVideoTitleTextButtonWrapper } from '~content-blocks/BlockVideoTitleTextButton';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';

function loadComponentFromConfig(key: ContentBlockType): FC {
	return (
		AdminConfigManager.getConfig().content_blocks[key] ||
		(() => <p>{key} component could not be found.</p>)
	);
}

export function GET_BLOCK_COMPONENT(
	type: ContentBlockType
	// biome-ignore lint/suspicious/noExplicitAny: todo
): FunctionComponent<any> {
	const blocks = {
		[ContentBlockType.AnchorLinks]: BlockButtonsWrapper,
		[ContentBlockType.Buttons]: BlockButtonsWrapper,
		[ContentBlockType.CTAs]: BlockCTAsWrapper,
		[ContentBlockType.Heading]: BlockHeading,
		[ContentBlockType.IFrame]: BlockIFrame,
		[ContentBlockType.ImageGrid]: BlockImageGridWrapper,
		[ContentBlockType.Image]: BlockImage,
		[ContentBlockType.Intro]: BlockIntro,
		[ContentBlockType.Klaar]: BlockKlaar,
		[ContentBlockType.MediaPlayerTitleTextButton]: BlockVideoTitleTextButtonWrapper,
		[ContentBlockType.MediaPlayer]: BlockVideoWrapper,
		[ContentBlockType.PageOverview]: BlockPageOverviewWrapper,
		[ContentBlockType.ProjectsSpotlight]: BlockProjectSpotlightWrapper,
		[ContentBlockType.AvoQuote]: BlockAvoQuote,
		[ContentBlockType.RichTextTwoColumns]: BlockRichTextWrapper,
		[ContentBlockType.RichText]: BlockRichTextWrapper,
		[ContentBlockType.Spotlight]: BlockSpotlight,
		[ContentBlockType.AvoHero]: AvoHeroWrapper,
		[ContentBlockType.ContentPageMeta]: BlockContentPageMeta,
		[ContentBlockType.LogoGrid]: BlockLogoGridWrapper,
		[ContentBlockType.UspGrid]: BlockUspGridWrapper,
		[ContentBlockType.Eventbrite]: BlockEventbrite,
		[ContentBlockType.Uitgeklaard]: BlockUitgeklaard,
		[ContentBlockType.ImageTitleTextButton]: BlockImageTitleTextButtonWrapper,
		[ContentBlockType.ThreeClickableTiles]: BlockThreeClickableTiles,
		[ContentBlockType.TagsWithLink]: BlockTagsWithLink,
		[ContentBlockType.CardsWithoutDescription]: BlockCardsWithoutDescription,
		[ContentBlockType.MaintainersGrid]: BlockMaintainersGrid,
		[ContentBlockType.ScrollDownNudge]: BlockScrollDownNudge,
		[ContentBlockType.ObjectsGrid]: BlockObjectsGrid,
		[ContentBlockType.HetArchiefVideo]: BlockHetArchiefVideo,

		// Het archief specific blocks
		[ContentBlockType.HetArchiefHeaderSearch]: BlockHetArchiefHeaderSearch,
		[ContentBlockType.OverviewNewspaperTitles]: BlockOverviewNewspaperTitles,
		[ContentBlockType.ContentEncloseGrid]: loadComponentFromConfig(
			ContentBlockType.ContentEncloseGrid
		),
		[ContentBlockType.Breadcrumbs]: BlockBreadcrumbs,
		[ContentBlockType.HetArchiefImageTextBackground]: BlockHetArchiefImageTextBackground,
		[ContentBlockType.OverviewWithCarousel]: BlockOverviewWithCarousel,
		[ContentBlockType.HetArchiefQuote]: BlockHetArchiefQuote,
		[ContentBlockType.HomepageBanner]: BlockHomepageBanner,
		[ContentBlockType.HighlightText]: BlockHighlightText,
		[ContentBlockType.ThemeReels]: BlockThemeReels,
		[ContentBlockType.OverviewThemes]: BlockOverviewThemes,
		[ContentBlockType.DoubleBanner]: BlockDoubleBanner,
		[ContentBlockType.HeroCarousel]: BlockHeroCarousel,
		[ContentBlockType.Timeline]: BlockTimeline,
		[ContentBlockType.ImageCarousel]: BlockImageCarousel,
		[ContentBlockType.TitleWithParallax]: BlockTitleWithParallax,

		// Avo specific blocks
		[ContentBlockType.MediaGrid]: loadComponentFromConfig(ContentBlockType.MediaGrid),
		[ContentBlockType.Search]: loadComponentFromConfig(ContentBlockType.Search),
		[ContentBlockType.AvoImageTextBackground]: BlockAvoImageTextBackground,
	};
	return blocks[type];
}

/**
 * @deprecated Legacy allowlist for the array-valued `components.state` repetition
 * mechanism (A). Do NOT add new block types here. For new blocks use the `fieldGroup` +
 * `repeat` mechanism (B), which is config-driven and needs no allowlist.
 * See `components/blocks/README.md`.
 */
export const REPEATABLE_CONTENT_BLOCKS = [
	ContentBlockType.AnchorLinks,
	ContentBlockType.Buttons,
	ContentBlockType.CTAs,
	ContentBlockType.ImageGrid,
	ContentBlockType.MediaGrid,
	ContentBlockType.ProjectsSpotlight,
	ContentBlockType.RichText,
	ContentBlockType.RichTextTwoColumns,
	ContentBlockType.Spotlight,
	ContentBlockType.LogoGrid,
	ContentBlockType.UspGrid,
	ContentBlockType.ThreeClickableTiles,
	ContentBlockType.TagsWithLink,
	ContentBlockType.CardsWithoutDescription,
	ContentBlockType.Timeline,
	// ContentBlockType.ContentEncloseGrid,
];

/**
 * Blocks that must receive a navigate function so that their buttons can link to their buttonActions
 */
export const NAVIGABLE_CONTENT_BLOCKS = [
	ContentBlockType.AnchorLinks,
	ContentBlockType.Buttons,
	ContentBlockType.CTAs,
	ContentBlockType.ImageGrid,
	ContentBlockType.ProjectsSpotlight,
	ContentBlockType.RichText,
	ContentBlockType.RichTextTwoColumns,
	ContentBlockType.Spotlight,
	ContentBlockType.AvoHero,
	ContentBlockType.PageOverview,
	ContentBlockType.MediaGrid,
	ContentBlockType.LogoGrid,
	ContentBlockType.UspGrid,
	ContentBlockType.Eventbrite,
	ContentBlockType.ThreeClickableTiles,
	ContentBlockType.OverviewNewspaperTitles,
	ContentBlockType.ContentEncloseGrid,
	ContentBlockType.Breadcrumbs,
];

/**
 * Blocks that must receive a commonUser object, to be able to render correctly
 */
export const USER_CONTENT_BLOCKS = [
	ContentBlockType.MediaPlayerTitleTextButton,
	ContentBlockType.MediaPlayer,
	ContentBlockType.PageOverview,
	ContentBlockType.MediaGrid,
	ContentBlockType.ProjectsSpotlight,
];

/**
 * Blocks that resolve the ie-objects in their own config through the proxy.
 * The blockId property will be added to these blocks automatically, so they can ask the proxy for
 * the playable display data of the objects their config references, instead of passing the object
 * ids and snipPoints along themselves.
 */
export const PLAYABLE_DISPLAY_DATA_BLOCKS = [
	ContentBlockType.HetArchiefVideo,
	ContentBlockType.HeroCarousel,
	ContentBlockType.Timeline,
];

/**
 * Blocks that need access to the top level content page
 * The contentPageInfo property will be added to these blocks automatically
 */
export const CONTENT_PAGE_ACCESS_BLOCKS = [ContentBlockType.ContentPageMeta];

export const IGNORE_BLOCK_LEVEL_PROPS = [
	'backgroundColor',
	'blockType',
	'elements',
	'overlayNextBlock',
	'padding',
	'position',
];
