import { FC, FunctionComponent } from 'react';
import { HeroWrapper } from '~content-blocks/BlockHero/HeroWrapper';
import { AdminConfigManager } from '~core/config';
import {
	BlockButtonsWrapper,
	BlockContentPageMeta,
	BlockCTAsWrapper,
	BlockEventbrite,
	BlockHeading,
	BlockIFrame,
	BlockImage,
	BlockImageGridWrapper,
	BlockImageTitleTextButtonWrapper,
	BlockIntro,
	BlockKlaar,
	BlockLogoGridWrapper,
	BlockPageOverviewWrapper,
	BlockProjectSpotlightWrapper,
	BlockQuote,
	BlockRichTextWrapper,
	BlockSpotlight,
	BlockTagsWithLink,
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
		[ContentBlockType.TagsWithLink]: BlockTagsWithLink,
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
	ContentBlockType.TagsWithLink,
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
];

/**
 * Blocks that must receive a commonUser object, to be able to render correctly
 */
export const USER_CONTENT_BLOCKS = [
	ContentBlockType.MediaPlayerTitleTextButton,
	ContentBlockType.PageOverview,
	ContentBlockType.MediaGrid,
];

/**
 * Blocks that must receive a renderMediaCardWrapper function so that a modal can be added to open media items with bookmark functionality
 */
export const OPEN_MEDIA_IN_POPUP_CONTENT_BLOCKS = [ContentBlockType.MediaGrid];

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
