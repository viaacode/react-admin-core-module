import {
	ANCHOR_LINKS_BLOCK_CONFIG,
	BUTTONS_BLOCK_CONFIG,
	CONTENT_PAGE_META_BLOCK_CONFIG,
	CTAS_BLOCK_CONFIG,
	EVENTBRITE_BLOCK_CONFIG,
	HEADING_BLOCK_CONFIG,
	HERO_BLOCK_CONFIG,
	IFRAME_BLOCK_CONFIG,
	IMAGE_BLOCK_CONFIG,
	IMAGE_GRID_BLOCK_CONFIG,
	IMAGE_TITLE_TEXT_BUTTON_BLOCK_CONFIG,
	INTRO_BLOCK_CONFIG,
	KLAAR_BLOCK_CONFIG,
	LOGO_GRID_BLOCK_CONFIG,
	MEDIA_GRID_BLOCK_CONFIG,
	MEDIA_PLAYER_BLOCK_CONFIG,
	MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_CONFIG,
	PAGE_OVERVIEW_BLOCK_CONFIG,
	PROJECTS_SPOTLIGHT_BLOCK_CONFIG,
	QUOTE_BLOCK_CONFIG,
	RICH_TEXT_BLOCK_CONFIG,
	RICH_TEXT_TWO_COLUMNS_BLOCK_CONFIG,
	SEARCH_BLOCK_CONFIG,
	TAGS_WITH_LINK_BLOCK_CONFIG,
	SPOTLIGHT_BLOCK_CONFIG,
	UITGEKLAARD_BLOCK_CONFIG,
	USP_GRID_BLOCK_CONFIG,
} from '~modules/content-page/components/blocks';
import { ContentBlockConfig, ContentBlockType } from '../types/content-block.types';

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
	[ContentBlockType.Uitgeklaard]: UITGEKLAARD_BLOCK_CONFIG,
	[ContentBlockType.ImageTitleTextButton]: IMAGE_TITLE_TEXT_BUTTON_BLOCK_CONFIG,
	[ContentBlockType.BlockTagsWithLink]: TAGS_WITH_LINK_BLOCK_CONFIG,
};
