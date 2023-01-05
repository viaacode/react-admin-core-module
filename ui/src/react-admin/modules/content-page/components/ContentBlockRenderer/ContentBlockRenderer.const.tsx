import {
	BlockEventbrite,
	BlockHeading,
	BlockIFrame,
	BlockImage,
	BlockIntro,
	BlockKlaar,
	BlockQuote,
	BlockSpotlight,
	BlockUitgeklaard,
} from '@viaa/avo2-components';
import React, { FC, FunctionComponent } from 'react';
import { AdminConfigManager } from '~core/config';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';

import {
	BlockImageGridWrapper,
	BlockLogoGridWrapper,
	BlockUspGridWrapper,
	ContentPageMeta,
	CtaWrapper,
	HeroWrapper,
	ImageTitleTextButtonWrapper,
	MediaPlayerTitleTextButtonWrapper,
	MediaPlayerWrapper,
	PageOverviewWrapper,
	ProjectSpotlightWrapper,
} from '../wrappers';
import ButtonsWrapper from '../wrappers/ButtonsWrapper/ButtonsWrapper';
import RichTextWrapper from '../wrappers/RichTextWrapper/RichTextWrapper';

function loadComponentFromConfig(key: ContentBlockType): FC {
	return AdminConfigManager.getConfig().content_blocks[key] || (() => <p>{key} component could not be found.</p>)
}

export function GET_BLOCK_COMPONENT(type: ContentBlockType): FunctionComponent<any> {
	return {
		[ContentBlockType.AnchorLinks]: ButtonsWrapper,
		[ContentBlockType.Buttons]: ButtonsWrapper,
		[ContentBlockType.CTAs]: CtaWrapper,
		[ContentBlockType.Heading]: BlockHeading,
		[ContentBlockType.IFrame]: BlockIFrame,
		[ContentBlockType.ImageGrid]: BlockImageGridWrapper,
		[ContentBlockType.Image]: BlockImage,
		[ContentBlockType.Intro]: BlockIntro,
		[ContentBlockType.Klaar]: BlockKlaar,
		[ContentBlockType.MediaPlayerTitleTextButton]: MediaPlayerTitleTextButtonWrapper,
		[ContentBlockType.MediaPlayer]: MediaPlayerWrapper,
		[ContentBlockType.PageOverview]: PageOverviewWrapper,
		[ContentBlockType.ProjectsSpotlight]: ProjectSpotlightWrapper,
		[ContentBlockType.Quote]: BlockQuote,
		[ContentBlockType.RichTextTwoColumns]: RichTextWrapper,
		[ContentBlockType.RichText]: RichTextWrapper,
		[ContentBlockType.Spotlight]: BlockSpotlight,
		[ContentBlockType.Hero]: HeroWrapper,
		[ContentBlockType.ContentPageMeta]: ContentPageMeta,
		[ContentBlockType.LogoGrid]: BlockLogoGridWrapper,
		[ContentBlockType.UspGrid]: BlockUspGridWrapper,
		[ContentBlockType.Eventbrite]: BlockEventbrite,
		[ContentBlockType.Uitgeklaard]: BlockUitgeklaard,
		[ContentBlockType.ImageTitleTextButton]: ImageTitleTextButtonWrapper,
		// Avo specific blocks
		[ContentBlockType.MediaGrid]: loadComponentFromConfig(ContentBlockType.MediaGrid),
		[ContentBlockType.Search]: loadComponentFromConfig(ContentBlockType.Search)
	}[type];
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
