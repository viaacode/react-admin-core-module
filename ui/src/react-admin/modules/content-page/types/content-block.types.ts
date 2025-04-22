import type { RichEditorState } from '@meemoo/react-components';
import type {
	ButtonAction,
	ButtonType,
	CTAProps,
	HeadingType,
	IconName,
	SpacerOption,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { ReactNode } from 'react';
import type { BlockAvoHeroProps } from '~content-blocks/BlockAvoHero/BlockAvoHero';
import type {
	ContentItemStyle,
	ContentTabStyle,
} from '~content-blocks/BlockPageOverview/BlockPageOverview.types';
import type { ImageInfo } from '~content-blocks/BlockSpotlight/BlockSpotlight';

// OPTIONS
export type AlignOption = 'left' | 'right' | 'center';

export type SimpleAlignOption = 'left' | 'right';

export type BackgroundAlignOption =
	| 'fill-screen'
	| 'left-screen'
	| 'left-inside-page'
	| 'right-inside-page'
	| 'right-screen';

export type FillOption = 'cover' | 'contain' | 'auto';

export type BlockGridFormatOption =
	| 'flex3'
	| 'squareSmall'
	| 'squareLarge'
	| '4:3'
	| '2:1'
	| '6:9'
	| '400x150'
	| '384x220';

export type WidthOption = 'full-width' | 'page-header' | string; // CSS width string: eg: 100%; 400px, 500px

export type HeadingTypeOption = 'h1' | 'h2' | 'h3' | 'h4';
export type HeadingSizeOption = 'small' | 'medium' | 'large';

export type CardWithoutDescriptionStyleOption = 'round' | 'square';

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
	InputBoxShadow = '#69C2DF',
	Transparent = 'TRANSPARENT',
	Platinum = '#F8F8F8',
	Neutral = '#727272',
	Zinc = '#ADADAD',
	SkyBlue = '#C3DDE6',
	Juniper = '#678588',
}

export enum GradientColor {
	BlackWhite = 'linear-gradient(to top, #fff 0%, #fff calc(100% - 16rem), #000 calc(100% - 16rem), #000 100%)',
}

export enum CustomBackground {
	MeemooLogo = '<MEEMOO_LOGO>',
}

export const ColorSelectGradientColors: Record<GradientColor, string> = {
	[GradientColor.BlackWhite]: 'linear-gradient(to top, #fff 0%, #fff 50%, #000 50%, #000 100%)',
};

export interface PaddingFieldState {
	top: SpacerOption;
	bottom: SpacerOption;
}

// CONTENT BLOCK CONFIG

// if 1 block, errors is a string[]. If multiple, it is a string[] index by their stateIndex, so string[][].
export type ContentBlockErrors = { [key: string]: (string | string[])[] };

export interface ContentBlockComponentsLimits {
	min?: number;
	max?: number;
}

// must match the lookup enumeration `content_block_types` on GraphQL.
export enum ContentBlockType {
	AnchorLinks = 'ANCHOR_LINKS',
	Buttons = 'BUTTONS',
	ContentPageMeta = 'CONTENT_PAGE_META',
	CTAs = 'CTAS',
	Eventbrite = 'EVENTBRITE',
	Heading = 'HEADING',
	AvoHero = 'HERO',
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
	ThreeClickableTiles = 'THREE_CLICKABLE_TILES',
	Uitgeklaard = 'UITGEKLAARD',
	UspGrid = 'USP_GRID',
	TagsWithLink = 'TAGS_WITH_LINKS',
	CardsWithoutDescription = 'CARDS_NO_DESCRIPTION',
	HetArchiefImageTextBackground = 'IMAGE_TEXT_BACKGROUND', // Hetarchief
	MaintainersGrid = 'MAINTAINERS_GRID',
	HetArchiefHeaderSearch = 'HETARCHIEF__HEADER_SEARCH',
	OverviewNewspaperTitles = 'OVERVIEW_NEWSPAPER_TITLES',
	ContentEncloseGrid = 'CONTENT_ENCLOSE_GRID',
	Breadcrumbs = 'BREADCRUMBS',
	AvoImageTextBackground = 'AVO_IMAGE_TEXT_BACKGROUND', // Avo
}

export enum ContentBlockEditor {
	AlignSelect = 'AlignSelect',
	Checkbox = 'Checkbox',
	ColorSelect = 'ColorSelect',
	ContentPicker = 'ContentPicker',
	ContentTypeAndLabelsPicker = 'ContentTypeAndLabelsPicker',
	FileUpload = 'FileUpload',
	IconPicker = 'IconPicker',
	DatePicker = 'DatePicker',
	MultiRange = 'MultiRange',
	PaddingSelect = 'PaddingSelect',
	PaddingSelectSingleValue = 'PaddingSelectSingleValue',
	Select = 'Select',
	TextArea = 'TextArea',
	TextInput = 'TextInput',
	RICH_TEXT_EDITOR = 'RICH_TEXT_EDITOR',
	UserGroupSelect = 'UserGroupSelect',
	MaintainerSelect = 'MaintainerSelect', // Used for selecting which maintainers copy right notice should be on the video still https://meemoo.atlassian.net/browse/AVO-3015
	UploadOrSelectVideoStill = 'UploadOrSelectVideoStill', // Used for selecting or uploading a video still for a video player https://meemoo.atlassian.net/browse/AVO-3015
}

export interface ContentBlockField {
	label?: string; // Optional for checkboxes, who have their own label
	editorType: ContentBlockEditor;
	editorProps?: any;
	note?: ReactNode;
	validator?: (value: any) => string[];
	repeat?: {
		defaultState: any;
		addButtonLabel?: string;
		deleteButtonLabel?: string;
	};
}

export type ContentBlockEditorType = 'field' | 'fieldGroup';

export interface ContentBlockFieldGroup {
	label?: string; // Optional for checkboxes, who have their own label
	fields: {
		[key: string]: ContentBlockField;
	};
	type?: ContentBlockEditorType;
	min?: number;
	max?: number;
	repeat?: {
		defaultState: any;
		addButtonLabel?: string;
		deleteButtonLabel?: string;
	};
}

/* CONTENT BLOCK STATE */
export interface DefaultContentBlockState {
	backgroundColor: Color | GradientColor | CustomBackground;
	headerBackgroundColor?: Color; // css color string. eg: '#222' or 'black' or 'rgb(0, 0, 255)'
	headerHeight?: string; // css height string. eg: '20px' or '15%'
	padding: PaddingFieldState;
	margin: PaddingFieldState;
	userGroupIds: number[];
	fullWidth?: boolean;
	anchor?: string; // Contains an id that the user can enter, so they can link to this block using the anchor-block buttons
}

export type ContentBlockState = DefaultContentBlockState;

export type ContentBlockStateType = 'components' | 'block';

export interface ContentBlockBlockConfig {
	state: ContentBlockState;
	fields: {
		[key: string]: ContentBlockField;
	};
}

export interface HeadingBlockComponentState {
	children: string;
	type: HeadingTypeOption;
	align: AlignOption;
}

export interface ImageBlockComponentState {
	title: string;
	text: string;
	imageSource: string;
	width: WidthOption;
	align: AlignOption;
	imageAction?: ButtonAction;
	imageAlt: string;
	buttonType?: ButtonType;
	buttonLabel?: string;
	buttonAltTitle?: string;
	buttonAction?: string;
	buttonAlign?: AlignOption;
}

export interface ImageGridBlockComponentStateFields {
	source: string;
	title?: string;
	text?: string;
	action?: ButtonAction;
}

export interface PageOverviewBlockComponentStateFields {
	tabs?: string[];
	tabStyle?: ContentTabStyle;
	allowMultiple?: boolean;
	centerHeader?: boolean;
	headerBackgroundColor?: Color;
	contentType: Avo.ContentPage.Type;
	itemStyle?: ContentItemStyle;
	showSectionTitle?: boolean; // Title of the label that groups multiple pages
	showTitle?: boolean; // Title of one of the pages
	showDescription?: boolean; // Description of one of the pages
	showDate?: boolean; // Date of one of the pages
	buttonLabel?: string;
	itemsPerPage?: number;
	navigate?: (buttonAction: ButtonAction) => void;
}

export interface ButtonsBlockComponentState {
	label: string;
	icon?: IconName;
	type?: ButtonType;
	navigate?: (buttonAction: ButtonAction) => void;
}

export interface RichTextBlockComponentState {
	content: string;
	// Each rich text editor state prop has to and with 'RichEditorStateKey'
	// So this can be removed before saving the page to the database in ContentPageService.removeRichEditorStateRecursively
	contentRichEditorState: RichEditorState | undefined;
	buttons?: ButtonsBlockComponentState[];
}

export interface AnchorLinksBlockComponentState {
	label: string;
	icon?: IconName;
	type?: ButtonType;
	navigate?: (buttonAction: ButtonAction) => void;
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
	item?: ButtonAction;
	autoplay: boolean;
}

export interface MediaPlayerTitleTextButtonBlockComponentState {
	align: AlignOption;
	buttonAction?: ButtonAction;
	buttonAltTitle?: string;
	buttonIcon?: IconName;
	buttonLabel: string;
	buttonType?: ButtonType;
	content: string;
	headingTitle: string;
	headingType: HeadingTypeOption;
	mediaAutoplay: boolean;
	mediaItem?: ButtonAction;
	mediaTitle: string;
}

export type ImageTitleTextButtonBlockComponentState = Omit<
	MediaPlayerTitleTextButtonBlockComponentState,
	'mediaTitle' | 'mediaAutoplay' | 'align'
> & {
	imageAction?: ButtonAction;
	imageAlt?: string;
	imagePosition?: Omit<AlignOption, 'center'>;
	imageSource?: string;
};

export interface MediaGridBlockComponentState {
	mediaItem?: ButtonAction;
	buttonLabel?: string;
	buttonAltTitle?: string;
	buttonIcon?: IconName;
	buttonType?: ButtonType;
	buttonAction?: ButtonAction;
	copyrightImage?: string | null;
	copyrightOwnerOrId?: string | null;
}

export interface MediaGridBlockState extends DefaultContentBlockState {
	title?: string;
	buttonLabel?: string;
	buttonAction?: ButtonAction;
	ctaTitle?: string;
	ctaTitleColor?: string;
	ctaTitleSize?: HeadingType;
	ctaContent?: string;
	ctaContentColor?: string;
	ctaButtonLabel?: string;
	ctaButtonType?: ButtonType;
	ctaButtonIcon?: IconName;
	ctaBackgroundColor?: string;
	ctaBackgroundImage?: string;
	ctaWidth?: string;
	openMediaInModal?: boolean;
	ctaButtonAction?: ButtonAction;
	navigate?: (buttonAction?: ButtonAction) => void;
	searchQuery?: ButtonAction;
	searchQueryLimit: string;
}

export interface AnchorLinksBlockState extends DefaultContentBlockState {
	align: AlignOption;
	hasDividers: boolean;
}

export type RepeatedContentBlockComponentState =
	| AnchorLinksBlockComponentState
	| ButtonsBlockComponentState
	| Partial<CTAProps>
	| ImageGridBlockComponentStateFields
	| MediaGridBlockComponentState
	| ImageInfo // project spotlight & spotlight
	| RichTextBlockComponentState
	| ThreeClickableTilesBlockComponentState;

export type SingleContentBlockComponentState =
	| HeadingBlockComponentState
	| Partial<BlockAvoHeroProps>
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

export type ContentBlockStateOption =
	| Partial<ContentBlockComponentState>
	| Partial<ContentBlockComponentState>[]
	| Partial<ContentBlockState>;

export interface ContentBlockComponentsConfig {
	name?: string;
	limits?: ContentBlockComponentsLimits;
	state: ContentBlockComponentState;
	fields: {
		[key: string]: any;
	};
}

export interface ContentBlockConfig {
	id?: number;
	errors?: ContentBlockErrors;
	name: string;
	components: ContentBlockComponentsConfig;
	block: ContentBlockBlockConfig;
	type: ContentBlockType;
	anchor?: string;
	position: number;
	unsaved?: boolean;
}

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

export interface ContentBlockMeta {
	index: number;
	config: ContentBlockConfig;
}

export const DEFAULT_BUTTON_PROPS = {
	type: 'primary',
	label: '',
	icon: undefined,
	buttonAction: undefined,
};

export interface TagsWithLinkBlockComponentState {
	label: string;
	link?: ButtonAction;
}

export interface ThreeClickableTilesBlockComponentState {
	title: string;
	titleType: HeadingTypeOption;
	image: string;
	link?: ButtonAction;
}

export interface CardWithoutDescriptionBlockComponentState {
	title: string;
	image?: string;
	style: CardWithoutDescriptionStyleOption;
	textColor: string;
	backgroundColor: string;
}

export interface ImageTextBackgroundBlockComponentState {
	heading: string;
	headingType: HeadingTypeOption;
	headingSize: HeadingSizeOption;
	content: string;
	textPadding: SpacerOption;
	foregroundColor: Color;
	backgroundColor: Color;
	image?: string;
	backgroundAlignment?: BackgroundAlignOption;
	buttonAction?: ButtonAction;
	buttonAltTitle?: string;
	buttonLabel: string;
	buttonType?: ButtonType;
	buttonIcon?: IconName;
	buttonIconAlignment?: SimpleAlignOption;
}

export interface MaintainersGridBlockComponentState {
	title: string;
	titleType: HeadingTypeOption;
	subtitle: string;
	buttonLabel?: string;
	buttonAction?: ButtonAction;
	visibleItems: number;
	maintainers: { imageSrc?: string; linkAction?: ButtonAction }[];
}

export interface HetArchiefHeaderSearchBlockComponentState {
	title: string;
	subtitles: { label: string }[];
	textBelowSearch?: string;
}

export interface HetArchiefIeObject {
	name: string;
	schemaIdentifier: string;
}
