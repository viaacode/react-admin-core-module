import type { Avo } from '@viaa/avo2-types';

// OPTIONS
export type AlignOption = 'left' | 'right' | 'center';

export type WidthOption = 'full-width' | 'page-header' | string; // CSS width string: eg: 100%; 400px, 500px

export type HeadingTypeOption = 'h1' | 'h2' | 'h3' | 'h4';

export enum Color {
	White = '#FFF',
	Black = '#000',
	Gray1000 = '#000000',
	Gray900 = '#0F171D',
	Gray800 = '#1D2B35',
	Gray700 = '#2B414F',
	Gray600 = '#385265',
	Gray500 = '#45647B',
	Gray400 = '#557891',
	Gray300 = '#7894A7',
	Gray200 = '#9CAFBD',
	Gray150 = '#BAC7D1',
	Gray100 = '#D6DEE3',
	Gray50 = '#EDEFF2',
	GrayShadow = '#222',
	NightBlue = '#3A586F',
	DarkNightBlue = '#182F42',
	TealBright = '#25A4CF',
	Teal = '#1D637A',
	TealDark = '#124455',
	Error200 = '#EE8176',
	Green = '#46D46E',
	Blue = '#4D76F3',
	SoftBlue = '#8AC1CE',
	OceanGreen = '#00C8AA',
	SeaGreen = '#009690',
	Silver = '#DBDBDB',
	Tapestry = '#B75B99',
	WineRed = '#98485C',
	Yellow = '#F3AA2E',
	DarkOrange = '#D03F06',
	FrenchRose = '#F33F67',
	Primary = '#25A4CF',
	Success = '#00C8AA',
	Error = '#DA3F34',
	AlertBackground = '#FFFFCC',
	AlertAccent = '#E9E994',
	TealBright200 = '#CFE3E9',
	BorderColor = '#3FB1D6',
	InputBoxShadow = '#69C2dF',
	Transparent = 'transparent',
	Platinum = '#f8f8f8',
	Neutral = '#727272',
	Zinc = '#adadad',
}

export interface PaddingFieldState {
	top: string;
	bottom: string;
}

// CONTENT BLOCK CONFIG

// if 1 block, errors is a string[]. If multiple, it is a string[] index by their stateIndex, so string[][].
export type ContentBlockErrors = { [key: string]: (string | string[])[] };

// must match the lookup enumeration `content_block_types` on GraphQL.
export enum ContentBlockType {
	AnchorLinks = 'ANCHOR_LINKS',
	Buttons = 'BUTTONS',
	ContentPageMeta = 'CONTENT_PAGE_META',
	CTAs = 'CTAS',
	Eventbrite = 'EVENTBRITE',
	Heading = 'HEADING',
	Hero = 'HERO',
	IFrame = 'IFRAME',
	Image = 'IMAGE',
	ImageGrid = 'IMAGE_GRID',
	ImageTitleTextButton = 'IMAGE_TITLE_TEXT_BUTTON',
	Intro = 'INTRO',
	Klaar = 'KLAAR',
	LogoGrid = 'LOGO_GRID',
	MediaGrid = 'MEDIA_GRID',
	MediaPlayer = 'MEDIA_PLAYER',
	MediaPlayerTitleTextButton = 'MEDIA_PLAYER_TITLE_TEXT_BUTTON',
	PageOverview = 'PAGE_OVERVIEW',
	ProjectsSpotlight = 'PROJECTS_SPOTLIGHT',
	Quote = 'QUOTE',
	RichText = 'RICH_TEXT',
	RichTextTwoColumns = 'RICH_TEXT_TWO_COLUMNS',
	Search = 'SEARCH',
	Spotlight = 'SPOTLIGHT',
	Uitgeklaard = 'UITGEKLAARD',
	UspGrid = 'USP_GRID',
}

/* CONTENT BLOCK STATE */
export interface DefaultContentBlockState {
	backgroundColor: Color;
	headerBackgroundColor?: Color; // css color string. eg: '#222' or 'black' or 'rgb(0, 0, 255)'
	headerHeight?: string; // css height string. eg: '20px' or '15%'
	padding: PaddingFieldState;
	margin: PaddingFieldState;
	userGroupIds: string[];
	fullWidth?: boolean;
	anchor?: string; // Contains an id that the user can enter, so they can link to this block using the anchor-block buttons
}

export interface HeadingBlockComponentState {
	children: string;
	type: HeadingTypeOption;
	align: AlignOption;
}

export interface ImageBlockComponentState {
	title: string;
	text: string;
	source: string;
	width: WidthOption;
}

export interface ImageGridBlockComponentStateFields {
	source: string;
	title?: string;
	text?: string;
	action?: string;
}

export interface PageOverviewBlockComponentStateFields {
	tabs?: string[];
	tabStyle?: 'ROUNDED_BADGES' | 'MENU_BAR';
	allowMultiple?: boolean;
	centerHeader?: boolean;
	headerBackgroundColor?: Color;
	contentType: Avo.ContentPage.Type;
	itemStyle?: 'GRID' | 'NEWS_LIST' | 'PROJECT_LIST' | 'ACCORDION';
	showTitle?: boolean;
	showDescription?: boolean;
	showDate?: boolean;
	buttonLabel?: string;
	itemsPerPage?: number;
	navigate?: (buttonAction: string) => void;
}

export interface ButtonsBlockComponentState {
	label: string;
	icon?: string;
	type?: string;
	navigate?: (buttonAction: string) => void;
}

export interface RichTextBlockComponentState {
	content: string;
	// Each rich text editor state prop has to and with 'RichEditorStateKey'
	// So this can be removed before saving the page to the database in ContentPageService.removeRichEditorStateRecursively
	// contentRichEditorState: RichEditorState | undefined;
	buttons?: ButtonsBlockComponentState[];
}

export interface AnchorLinksBlockComponentState {
	label: string;
	icon?: string;
	type?: string;
	navigate?: (buttonAction: string) => void;
}

export interface KlaarBlockComponentState {
	titles: string[];
	date: string;
}

export interface IntroBlockComponentState {
	title: string;
	headingType: HeadingTypeOption;
	content: string;
	align: AlignOption;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IFrameBlockComponentState {
	title: string;
	src: string;
}

export interface QuoteBlockComponentState {
	quote: string;
	authorName: string;
	authorInitials: string;
	authorImage?: string;
}

export interface MediaPlayerBlockComponentState {
	title: string;
	item?: string;
	autoplay: boolean;
}

export interface MediaPlayerTitleTextButtonBlockComponentState {
	mediaTitle: string;
	mediaItem?: string;
	headingType: HeadingTypeOption;
	headingTitle: string;
	content: string;
	buttonLabel: string;
	buttonIcon?: string;
	buttonType?: string;
	buttonAction?: string;
	align: AlignOption;
	mediaAutoplay: boolean;
}

export interface MediaGridBlockComponentState {
	mediaItem?: string;
	buttonLabel?: string;
	buttonAltTitle?: string;
	buttonIcon?: string;
	buttonType?: string;
	buttonAction?: string;
}

export type RepeatedContentBlockComponentState =
	| AnchorLinksBlockComponentState
	| ButtonsBlockComponentState
	| Partial<Record<string, unknown>>
	| ImageGridBlockComponentStateFields
	| MediaGridBlockComponentState
	| {
			image: string;
			title: string;
			buttonAction?: string;
			className?: string;
	  } // project spotlight & spotlight
	| RichTextBlockComponentState;

export type SingleContentBlockComponentState =
	| HeadingBlockComponentState
	| Partial<Record<string, unknown>>
	| IFrameBlockComponentState
	| ImageBlockComponentState
	| IntroBlockComponentState
	| KlaarBlockComponentState
	| MediaPlayerBlockComponentState
	| MediaPlayerTitleTextButtonBlockComponentState
	| PageOverviewBlockComponentStateFields
	| QuoteBlockComponentState
	| RichTextBlockComponentState
	| {
			// Search block & content page meta
	  };

export type ContentBlockComponentState =
	| RepeatedContentBlockComponentState[]
	| SingleContentBlockComponentState;

export interface DbContentBlock {
	id?: number;
	errors?: ContentBlockErrors;
	name: string;
	components: ContentBlockComponentState;
	block: DefaultContentBlockState;
	type: ContentBlockType;
	anchor?: string;
	position: number;
}
