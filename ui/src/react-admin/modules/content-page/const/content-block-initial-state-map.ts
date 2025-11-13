import { INITIAL_ANCHOR_LINKS_COMPONENTS_STATE } from '~content-blocks/anchor-links';
import { INITIAL_AVO_HERO_COMPONENTS_STATE } from '~content-blocks/BlockAvoHero/index';
import { INITIAL_AVO_IMAGE_TEXT_BACKGROUND_BLOCK_STATE } from '~content-blocks/BlockAvoImageTextBackground/index';
import { INITIAL_BREADCRUMBS_BLOCK_STATE } from '~content-blocks/BlockBreadcrumbs/BlockBreadcrumbs.editorconfig';
import { INITIAL_BUTTONS_COMPONENTS_STATE } from '~content-blocks/BlockButtons/index';
import { INITIAL_CARDS_WITHOUT_DESCRIPTION_COMPONENTS_STATE } from '~content-blocks/BlockCardsWithoutDescription/index';
import { INITIAL_CONTENT_ENCLOSE_BLOCK_STATE } from '~content-blocks/BlockContentEnclose/BlockContentEnclose.editorconfig';
import { INITIAL_CONTENT_PAGE_META_COMPONENTS_STATE } from '~content-blocks/BlockContentPageMeta/index';
import { INITIAL_CTAS_COMPONENTS_STATE } from '~content-blocks/BlockCTAs/index';
import { INITIAL_EVENTBRITE_COMPONENTS_STATE } from '~content-blocks/BlockEventbrite/index';
import { INITIAL_HEADING_COMPONENTS_STATE } from '~content-blocks/BlockHeading/index';
import { INITIAL_HET_ARCHIEF_HEADER_SEARCH_BLOCK_STATE } from '~content-blocks/BlockHetArchiefHeaderSearch/BlockHetArchiefHeaderSearch.editorconfig';
import { INITIAL_HET_ARCHIEF_IMAGE_TEXT_BACKGROUND_BLOCK_STATE } from '~content-blocks/BlockHetArchiefImageTextBackground/index';
import { INITIAL_IFRAME_COMPONENTS_STATE } from '~content-blocks/BlockIFrame/index';
import { INITIAL_IMAGE_COMPONENTS_STATE } from '~content-blocks/BlockImage/index';
import {
	INITIAL_IMAGE_GRID_COMPONENTS_STATE,
	INITIAL_LOGO_GRID_COMPONENTS_STATE,
	INITIAL_USP_GRID_COMPONENTS_STATE,
} from '~content-blocks/BlockImageGrid/index';
import { INITIAL_IMAGE_TITLE_TEXT_BUTTON_BLOCK_STATE } from '~content-blocks/BlockImageTitleTextButton/index';
import { INITIAL_INTRO_COMPONENTS_STATE } from '~content-blocks/BlockIntro/index';
import { INITIAL_KLAAR_COMPONENTS_STATE } from '~content-blocks/BlockKlaar/index';
import { INITIAL_MAINTAINERS_GRID_BLOCK_STATE } from '~content-blocks/BlockMaintainersGrid/index';
import { INITIAL_MEDIA_GRID_COMPONENTS_STATE } from '~content-blocks/BlockMediaGrid/index';
import { INITIAL_OVERVIEW_NEWSPAPER_TITLES_BLOCK_STATE } from '~content-blocks/BlockOverviewNewspaperTitles/index';
import { INITIAL_PAGE_OVERVIEW_COMPONENTS_STATE } from '~content-blocks/BlockPageOverview/index';
import { INITIAL_QUOTE_COMPONENTS_STATE } from '~content-blocks/BlockQuote/index';
import {
	INITIAL_RICH_TEXT_COMPONENTS_STATE,
	INITIAL_RICH_TEXT_TWO_COLUMNS_COMPONENTS_STATE,
} from '~content-blocks/BlockRichText/index';
import { INITIAL_SCROLL_DOWN_NUDGE_BLOCK_STATE } from '~content-blocks/BlockScrollDownNudge/index';
import {
	INITIAL_PROJECTS_SPOTLIGHT_COMPONENTS_STATE,
	INITIAL_SPOTLIGHT_COMPONENTS_STATE,
} from '~content-blocks/BlockSpotlight/index';
import { INITIAL_TAGS_WITH_LINK_COMPONENTS_STATE } from '~content-blocks/BlockTagsWithLink/index';
import { INITIAL_THREE_CLICKABLE_TILES_COMPONENTS_STATE } from '~content-blocks/BlockThreeClickableTiles/index';
import { INITIAL_UITGEKLAARD_BLOCK_STATE } from '~content-blocks/BlockUitgeklaard/index';
import { INITIAL_MEDIA_PLAYER_COMPONENTS_STATE } from '~content-blocks/BlockVideo/index';
import { INITIAL_MEDIA_PLAYER_TITLE_TEXT_BUTTON_COMPONENTS_STATE } from '~content-blocks/BlockVideoTitleTextButton/index';
import { INITIAL_SEARCH_COMPONENTS_STATE } from '~content-blocks/search';
import type { ContentBlockComponentState } from '../types/content-block.types';
import { ContentBlockType } from '../types/content-block.types';

export const CONTENT_BLOCK_INITIAL_STATE_MAP: {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	[type in ContentBlockType]: (position?: number) => ContentBlockComponentState;
	/* eslint-enable @typescript-eslint/no-unused-vars */
} = {
	[ContentBlockType.AnchorLinks]: INITIAL_ANCHOR_LINKS_COMPONENTS_STATE,
	[ContentBlockType.Buttons]: INITIAL_BUTTONS_COMPONENTS_STATE,
	[ContentBlockType.CTAs]: INITIAL_CTAS_COMPONENTS_STATE,
	[ContentBlockType.Heading]: INITIAL_HEADING_COMPONENTS_STATE,
	[ContentBlockType.AvoHero]: INITIAL_AVO_HERO_COMPONENTS_STATE,
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
	[ContentBlockType.AvoImageTextBackground]: INITIAL_AVO_IMAGE_TEXT_BACKGROUND_BLOCK_STATE,
	[ContentBlockType.HetArchiefImageTextBackground]:
		INITIAL_HET_ARCHIEF_IMAGE_TEXT_BACKGROUND_BLOCK_STATE,
	[ContentBlockType.MaintainersGrid]: INITIAL_MAINTAINERS_GRID_BLOCK_STATE,
	[ContentBlockType.HetArchiefHeaderSearch]: INITIAL_HET_ARCHIEF_HEADER_SEARCH_BLOCK_STATE,
	[ContentBlockType.OverviewNewspaperTitles]: INITIAL_OVERVIEW_NEWSPAPER_TITLES_BLOCK_STATE,
	[ContentBlockType.ContentEncloseGrid]: INITIAL_CONTENT_ENCLOSE_BLOCK_STATE,
	[ContentBlockType.Breadcrumbs]: INITIAL_BREADCRUMBS_BLOCK_STATE,
	[ContentBlockType.ScrollDownNudge]: INITIAL_SCROLL_DOWN_NUDGE_BLOCK_STATE,
};
