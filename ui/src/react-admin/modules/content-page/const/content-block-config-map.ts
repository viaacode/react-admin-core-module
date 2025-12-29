import { ANCHOR_LINKS_BLOCK_CONFIG } from '~content-blocks/anchor-links';
import { AVO_HERO_BLOCK_CONFIG } from '~content-blocks/BlockAvoHero';
import { AVO_IMAGE_TEXT_BACKGROUND_BLOCK_CONFIG } from '~content-blocks/BlockAvoImageTextBackground';
import { CONTENT_BREADCRUMBS_CONFIG } from '~content-blocks/BlockBreadcrumbs';
import { BUTTONS_BLOCK_CONFIG } from '~content-blocks/BlockButtons';
import { CARDS_WITHOUT_DESCRIPTION_BLOCK_CONFIG } from '~content-blocks/BlockCardsWithoutDescription';
import { CONTENT_ENCLOSE_BLOCK_CONFIG } from '~content-blocks/BlockContentEnclose';
import { CONTENT_PAGE_META_BLOCK_CONFIG } from '~content-blocks/BlockContentPageMeta';
import { CTAS_BLOCK_CONFIG } from '~content-blocks/BlockCTAs';
import { EVENTBRITE_BLOCK_CONFIG } from '~content-blocks/BlockEventbrite';
import { HEADING_BLOCK_CONFIG } from '~content-blocks/BlockHeading';
import { HET_ARCHIEF_HEADER_SEARCH_BLOCK_CONFIG } from '~content-blocks/BlockHetArchiefHeaderSearch/BlockHetArchiefHeaderSearch.editorconfig';
import { HET_ARCHIEF_IMAGE_TEXT_BACKGROUND_BLOCK_CONFIG } from '~content-blocks/BlockHetArchiefImageTextBackground';
import { IFRAME_BLOCK_CONFIG } from '~content-blocks/BlockIFrame';
import { IMAGE_BLOCK_CONFIG } from '~content-blocks/BlockImage';
import {
	IMAGE_GRID_BLOCK_CONFIG,
	LOGO_GRID_BLOCK_CONFIG,
	USP_GRID_BLOCK_CONFIG,
} from '~content-blocks/BlockImageGrid';
import { IMAGE_TITLE_TEXT_BUTTON_BLOCK_CONFIG } from '~content-blocks/BlockImageTitleTextButton';
import { INTRO_BLOCK_CONFIG } from '~content-blocks/BlockIntro';
import { KLAAR_BLOCK_CONFIG } from '~content-blocks/BlockKlaar';
import { MAINTAINERS_GRID_BLOCK_CONFIG } from '~content-blocks/BlockMaintainersGrid';
import { MEDIA_GRID_BLOCK_CONFIG } from '~content-blocks/BlockMediaGrid';
import { OVERVIEW_NEWSPAPER_TITLES_BLOCK_CONFIG } from '~content-blocks/BlockOverviewNewspaperTitles';
import { QUOTE_BLOCK_CONFIG } from '~content-blocks/BlockQuote';
import {
	RICH_TEXT_BLOCK_CONFIG,
	RICH_TEXT_TWO_COLUMNS_BLOCK_CONFIG,
} from '~content-blocks/BlockRichText';
import { CONTENT_SCROLL_DOWN_NUDGE_CONFIG } from '~content-blocks/BlockScrollDownNudge';
import {
	PROJECTS_SPOTLIGHT_BLOCK_CONFIG,
	SPOTLIGHT_BLOCK_CONFIG,
} from '~content-blocks/BlockSpotlight';
import { TAGS_WITH_LINK_BLOCK_CONFIG } from '~content-blocks/BlockTagsWithLink';
import { THREE_CLICKABLE_TILES_BLOCK_CONFIG } from '~content-blocks/BlockThreeClickableTiles';
import { UITGEKLAARD_BLOCK_CONFIG } from '~content-blocks/BlockUitgeklaard';
import { MEDIA_PLAYER_BLOCK_CONFIG } from '~content-blocks/BlockVideo';
import { MEDIA_PLAYER_TITLE_TEXT_BUTTON_BLOCK_CONFIG } from '~content-blocks/BlockVideoTitleTextButton';
import { SEARCH_BLOCK_CONFIG } from '~content-blocks/search';
import { PAGE_OVERVIEW_BLOCK_CONFIG } from '~modules/content-page/components/blocks/BlockPageOverview/BlockPageOverview.editorconfig';
import type { ContentBlockConfig } from '../types/content-block.types';
import { ContentBlockType } from '../types/content-block.types';

export const CONTENT_BLOCK_CONFIG_MAP: Record<
	ContentBlockType,
	(position?: number) => ContentBlockConfig
> = {
	[ContentBlockType.AnchorLinks]: ANCHOR_LINKS_BLOCK_CONFIG,
	[ContentBlockType.Buttons]: BUTTONS_BLOCK_CONFIG,
	[ContentBlockType.CTAs]: CTAS_BLOCK_CONFIG,
	[ContentBlockType.Heading]: HEADING_BLOCK_CONFIG,
	[ContentBlockType.AvoHero]: AVO_HERO_BLOCK_CONFIG,
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
	[ContentBlockType.ThreeClickableTiles]: THREE_CLICKABLE_TILES_BLOCK_CONFIG,
	[ContentBlockType.TagsWithLink]: TAGS_WITH_LINK_BLOCK_CONFIG,
	[ContentBlockType.CardsWithoutDescription]: CARDS_WITHOUT_DESCRIPTION_BLOCK_CONFIG,
	[ContentBlockType.AvoImageTextBackground]: AVO_IMAGE_TEXT_BACKGROUND_BLOCK_CONFIG, // Avo
	[ContentBlockType.HetArchiefImageTextBackground]: HET_ARCHIEF_IMAGE_TEXT_BACKGROUND_BLOCK_CONFIG, // Hetarchief
	[ContentBlockType.MaintainersGrid]: MAINTAINERS_GRID_BLOCK_CONFIG,
	[ContentBlockType.HetArchiefHeaderSearch]: HET_ARCHIEF_HEADER_SEARCH_BLOCK_CONFIG,
	[ContentBlockType.OverviewNewspaperTitles]: OVERVIEW_NEWSPAPER_TITLES_BLOCK_CONFIG,
	[ContentBlockType.ContentEncloseGrid]: CONTENT_ENCLOSE_BLOCK_CONFIG,
	[ContentBlockType.Breadcrumbs]: CONTENT_BREADCRUMBS_CONFIG,
	[ContentBlockType.ScrollDownNudge]: CONTENT_SCROLL_DOWN_NUDGE_CONFIG,
};
