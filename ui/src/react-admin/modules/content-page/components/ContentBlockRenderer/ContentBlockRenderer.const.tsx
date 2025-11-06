import type { FC, FunctionComponent } from 'react';
import { AvoHeroWrapper } from '~content-blocks/BlockAvoHero/AvoHeroWrapper.js';
import { BlockAvoImageTextBackground } from '~content-blocks/BlockAvoImageTextBackground/index.js';
import { BlockBreadcrumbs } from '~content-blocks/BlockBreadcrumbs/index.js';
import { BlockButtonsWrapper } from '~content-blocks/BlockButtons/index.js';
import { BlockCardsWithoutDescription } from '~content-blocks/BlockCardsWithoutDescription/index.js';
import { BlockContentPageMeta } from '~content-blocks/BlockContentPageMeta/index.js';
import { BlockCTAsWrapper } from '~content-blocks/BlockCTAs/index.js';
import { BlockEventbrite } from '~content-blocks/BlockEventbrite/index.js';
import { BlockHeading } from '~content-blocks/BlockHeading/index.js';
import { BlockHetArchiefHeaderSearch } from '~content-blocks/BlockHetArchiefHeaderSearch/BlockHetArchiefHeaderSearch.js';
import { BlockHetArchiefImageTextBackground } from '~content-blocks/BlockHetArchiefImageTextBackground/index.js';
import { BlockIFrame } from '~content-blocks/BlockIFrame/index.js';
import { BlockImage } from '~content-blocks/BlockImage/index.js';
import {
	BlockImageGridWrapper,
	BlockLogoGridWrapper,
	BlockUspGridWrapper,
} from '~content-blocks/BlockImageGrid/index.js';
import { BlockImageTitleTextButtonWrapper } from '~content-blocks/BlockImageTitleTextButton/index.js';
import { BlockIntro } from '~content-blocks/BlockIntro/index.js';
import { BlockKlaar } from '~content-blocks/BlockKlaar/index.js';
import { BlockMaintainersGrid } from '~content-blocks/BlockMaintainersGrid/index.js';
import { BlockOverviewNewspaperTitles } from '~content-blocks/BlockOverviewNewspaperTitles/index.js';
import { BlockPageOverviewWrapper } from '~content-blocks/BlockPageOverview/index.js';
import { BlockQuote } from '~content-blocks/BlockQuote/index.js';
import { BlockRichTextWrapper } from '~content-blocks/BlockRichText/index.js';
import { BlockScrollDownNudge } from '~content-blocks/BlockScrollDownNudge/index.js';
import {
	BlockProjectSpotlightWrapper,
	BlockSpotlight,
} from '~content-blocks/BlockSpotlight/index.js';
import { BlockTagsWithLink } from '~content-blocks/BlockTagsWithLink/index.js';
import { BlockThreeClickableTiles } from '~content-blocks/BlockThreeClickableTiles/index.js';
import { BlockUitgeklaard } from '~content-blocks/BlockUitgeklaard/index.js';
import { BlockVideoWrapper } from '~content-blocks/BlockVideo/index.js';
import { BlockVideoTitleTextButtonWrapper } from '~content-blocks/BlockVideoTitleTextButton/index.js';
import { AdminConfigManager } from '~core/config/config.class.js';
import { ContentBlockType } from '~modules/content-page/types/content-block.types.js';

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
		[ContentBlockType.Quote]: BlockQuote,
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

		// Het archief specific blocks
		[ContentBlockType.HetArchiefHeaderSearch]: BlockHetArchiefHeaderSearch,
		[ContentBlockType.OverviewNewspaperTitles]: BlockOverviewNewspaperTitles,
		[ContentBlockType.ContentEncloseGrid]: loadComponentFromConfig(
			ContentBlockType.ContentEncloseGrid
		),
		[ContentBlockType.Breadcrumbs]: BlockBreadcrumbs,
		[ContentBlockType.HetArchiefImageTextBackground]: BlockHetArchiefImageTextBackground,

		// Avo specific blocks
		[ContentBlockType.MediaGrid]: loadComponentFromConfig(ContentBlockType.MediaGrid),
		[ContentBlockType.Search]: loadComponentFromConfig(ContentBlockType.Search),
		[ContentBlockType.AvoImageTextBackground]: BlockAvoImageTextBackground,
	};
	return blocks[type];
}

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
 * Blocks that need access to the top level content page
 * The contentPageInfo property will be added to these blocks automatically
 */
export const CONTENT_PAGE_ACCESS_BLOCKS = [ContentBlockType.ContentPageMeta];

export const IGNORE_BLOCK_LEVEL_PROPS = [
	'backgroundColor',
	'blockType',
	'elements',
	'padding',
	'position',
];
