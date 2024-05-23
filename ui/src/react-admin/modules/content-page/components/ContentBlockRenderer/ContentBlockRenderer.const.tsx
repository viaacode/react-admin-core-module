import { FC, FunctionComponent } from 'react';
import { HeroWrapper } from '~content-blocks/BlockHero/HeroWrapper';
import { BlockHetArchiefHeaderSearch } from '~content-blocks/BlockHetArchiefHeaderSearch';
import { AdminConfigManager } from '~core/config';
import {
	BlockButtonsWrapper,
	BlockCardsWithoutDescription,
	BlockContentPageMeta,
	BlockCTAsWrapper,
	BlockEventbrite,
	BlockHeading,
	BlockIFrame,
	BlockImage,
	BlockImageGridWrapper,
	BlockImageTextBackground,
	BlockImageTitleTextButtonWrapper,
	BlockIntro,
	BlockKlaar,
	BlockLogoGridWrapper,
	BlockMaintainersGrid,
	BlockOverviewNewspaperTitles,
	BlockPageOverviewWrapper,
	BlockProjectSpotlightWrapper,
	BlockQuote,
	BlockRichTextWrapper,
	BlockSpotlight,
	BlockTagsWithLink,
	BlockThreeClickableTiles,
	BlockUitgeklaard,
	BlockUspGridWrapper,
	BlockVideoTitleTextButtonWrapper,
	BlockVideoWrapper,
} from '~modules/content-page/components/blocks';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';

function loadComponentFromConfig(key: ContentBlockType): FC {
	return (
		AdminConfigManager.getConfig().content_blocks[key] ||
		(() => <p>{key} component could not be found.</p>)
	);
}

export function GET_BLOCK_COMPONENT(type: ContentBlockType): FunctionComponent<any> {
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
		[ContentBlockType.Hero]: HeroWrapper,
		[ContentBlockType.ContentPageMeta]: BlockContentPageMeta,
		[ContentBlockType.LogoGrid]: BlockLogoGridWrapper,
		[ContentBlockType.UspGrid]: BlockUspGridWrapper,
		[ContentBlockType.Eventbrite]: BlockEventbrite,
		[ContentBlockType.Uitgeklaard]: BlockUitgeklaard,
		[ContentBlockType.ImageTitleTextButton]: BlockImageTitleTextButtonWrapper,
		[ContentBlockType.ThreeClickableTiles]: BlockThreeClickableTiles,
		[ContentBlockType.TagsWithLink]: BlockTagsWithLink,
		[ContentBlockType.CardsWithoutDescription]: BlockCardsWithoutDescription,
		[ContentBlockType.ImageTextBackground]: BlockImageTextBackground,
		[ContentBlockType.MaintainersGrid]: BlockMaintainersGrid,

		// Het archief specific blocks
		[ContentBlockType.HetArchiefHeaderSearch]: BlockHetArchiefHeaderSearch,
		[ContentBlockType.OverviewNewspaperTitles]: BlockOverviewNewspaperTitles,

		// Avo specific blocks
		[ContentBlockType.MediaGrid]: loadComponentFromConfig(ContentBlockType.MediaGrid),
		[ContentBlockType.Search]: loadComponentFromConfig(ContentBlockType.Search),
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
	ContentBlockType.Hero,
	ContentBlockType.PageOverview,
	ContentBlockType.MediaGrid,
	ContentBlockType.LogoGrid,
	ContentBlockType.UspGrid,
	ContentBlockType.Eventbrite,
	ContentBlockType.ThreeClickableTiles,
	ContentBlockType.OverviewNewspaperTitles,
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
