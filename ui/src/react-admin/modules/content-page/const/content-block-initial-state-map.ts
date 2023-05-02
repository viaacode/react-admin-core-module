import {
	INITIAL_ANCHOR_LINKS_COMPONENTS_STATE,
	INITIAL_BUTTONS_COMPONENTS_STATE,
	INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE,
	INITIAL_CONTENT_PAGE_META_COMPONENTS_STATE,
	INITIAL_CTAS_COMPONENTS_STATE,
	INITIAL_EVENTBRITE_COMPONENTS_STATE,
	INITIAL_HEADING_COMPONENTS_STATE,
	INITIAL_HERO_COMPONENTS_STATE,
	INITIAL_IFRAME_COMPONENTS_STATE,
	INITIAL_IMAGE_COMPONENTS_STATE,
	INITIAL_IMAGE_GRID_COMPONENTS_STATE,
	INITIAL_IMAGE_TEXT_BACKGROUND_BLOCK_STATE,
	INITIAL_IMAGE_TITLE_TEXT_BUTTON_BLOCK_STATE,
	INITIAL_INTRO_COMPONENTS_STATE,
	INITIAL_KLAAR_COMPONENTS_STATE,
	INITIAL_LOGO_GRID_COMPONENTS_STATE,
	INITIAL_MAINTAINERS_GRID_BLOCK_STATE,
	INITIAL_MEDIA_GRID_COMPONENTS_STATE,
	INITIAL_MEDIA_PLAYER_COMPONENTS_STATE,
	INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE,
	INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE,
	INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE,
	INITIAL_QUOTE_COMPONENTS_STATE,
	INITIAL_RICH_TEXT_COMPONENTS_STATE,
	INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE,
	INITIAL_SEARCH_COMPONENTS_STATE,
	INITIAL_SPOTLIGHT_COMPONENTS_STATE,
	INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE,
	INITIAL_THREE_CLICKABLE_TILES_COMPONENTS_STATE,
	INITIAL_UITGEKLAARD_BLOCK_STATE,
	INITIAL_USP_GRID_COMPONENTS_STATE,
} from '~modules/content-page/components/blocks';
import { ContentBlockComponentState, ContentBlockType } from '../types/content-block.types';

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
	[ContentBlockType.Uitgeklaard]: INITIAL_UITGEKLAARD_BLOCK_STATE,
	[ContentBlockType.ImageTitleTextButton]: INITIAL_IMAGE_TITLE_TEXT_BUTTON_BLOCK_STATE,
	[ContentBlockType.ThreeClickableTiles]: INITIAL_THREE_CLICKABLE_TILES_COMPONENTS_STATE,
	[ContentBlockType.TagsWithLink]: INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE,
	[ContentBlockType.CardsWithoutDescription]: INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE,
	[ContentBlockType.ImageTextBackground]: INITIAL_IMAGE_TEXT_BACKGROUND_BLOCK_STATE,
	[ContentBlockType.MaintainersGrid]: INITIAL_MAINTAINERS_GRID_BLOCK_STATE,
};
