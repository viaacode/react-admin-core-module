import type { LinkTarget } from '@viaa/avo2-components';
import type {
	AvoCoreDatabaseType,
	AvoEducationOrganizationOrganization,
	AvoUserCommonUser,
} from '@viaa/avo2-types';
import type { ComponentType, FC, FunctionComponent, MouseEvent, ReactNode } from 'react';
import type { OrderProperty } from '~content-blocks/BlockObjectsGrid/BlockObjectsGrid.types.ts';
import type { ContentBlockType } from '~modules/content-page/types/content-block.types';
import type {
	ContentPageInfo,
	ContentPageWidth,
} from '~modules/content-page/types/content-pages.types';
import type { App, Locale } from '~modules/translations/translations.core.types';
import type { UserBulkAction } from '~modules/user/user.types';
import type { FlowPlayerWrapperProps } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper.types';
import type { IeObjectType } from '~shared/helpers/map-format-to-type.ts';
import type { PlayableDisplayIeObjectPage } from '~shared/services/ie-objects-service/ie-objects.types';

/**
 * What a consuming app needs to log a play of an ie-object rendered by a content block. The
 * admin-core does no analytics of its own, so it only reports the play and the context it has.
 */
export interface IeObjectPlayInfo {
	schemaIdentifier: string;
	maintainerId: string;
	dctermsFormat: IeObjectType;
	/** True when the content block config cut this object to a snippet, ie. it has a start and end */
	isBlockSnippet: boolean;
}

export enum ToastType {
	ERROR = 'error',
	INFO = 'info',
	SPINNER = 'spinner',
	SUCCESS = 'success',
}

export interface ToastInfo {
	title?: string;
	description?: string | ReactNode;
	type: ToastType;
}

export interface ToastService {
	showToast: (toastInfo: ToastInfo) => string;
	hideToast: (toastId: string) => void;
}

export interface I18n {
	tHtml: (
		translationKey: string,
		variables?: Record<string, string>,
		apps?: App[]
	) => ReactNode | string;
	tText: (translationKey: string, variables?: Record<string, string>, apps?: App[]) => string;
}

export interface LinkInfo {
	className?: string;
	to?: string;
	onClick?: (evt: MouseEvent) => void;
	onKeyUp?: (evt: KeyboardEvent) => void;
	title?: string;
	children: ReactNode;
	target?: LinkTarget;
	tabIndex?: number;
}

export type NavigateFunction = (to: string, options?: { replace?: boolean }) => Promise<void>;

export interface SearchFilter {
	field: string;
	operator: string;
	value?: string;
	multiValue?: string[];
}

export interface IeObjectsSearchBody {
	filters: SearchFilter[];
	size: number;
	page: number;
	requestedAggs?: string[];
	orderProp?: OrderProperty;
	orderDirection?: 'asc' | 'desc';
}

export interface AdminConfig {
	// Core module configurations
	flowplayer: {
		FLOW_PLAYER_TOKEN: string;
		FLOW_PLAYER_ID: string;
	};
	staticPages: Partial<Record<Locale, string[]>>;
	contentPage?: {
		availableContentBlocks: ContentBlockType[];
		defaultPageWidth: ContentPageWidth;
		onSaveContentPage: (contentPageInfo: ContentPageInfo) => Promise<void>;
	};
	navigationBars?: {
		enableIcons: boolean;
		customNavigationElements: string[];
	};
	// Secondary services and config
	services: {
		getContentPageByLanguageAndPathEndpoint: string | null;
		toastService: ToastService;
		i18n: I18n;
		educationOrganisationService: EducationOrganisationService;
		router: {
			// Function that navigates to a given route programmatically
			navigateFunc: NavigateFunction;

			// A link component, just like <Link to="">click here</Link>
			Link: FunctionComponent<LinkInfo>;
		};
		queryCache: {
			clear: (key: string) => Promise<void>;
		};
		search?: {
			// Converts a hetarchief search-page url (as stored on eg. the ObjectsGrid content-page
			// block) into an ie-objects search API request body. Lives in the config so the client's
			// own url-filter-mapping logic (used by its search page) can be reused here, without the
			// admin-core needing to depend on the client package.
			clientSearchUrlToApiSearchUrl: (searchQuery: string) => IeObjectsSearchBody;
		};
	};
	components: {
		loader: {
			component: ComponentType | null;
		};
		defaultAudioStill: string;
		flowplayer?: FC<FlowPlayerWrapperProps>; // User by avo for
		/**
		 * The IIIF viewer a newspaper opens in, injected by the host the way `flowplayer` is.
		 *
		 * It takes only the object's id: the viewer needs the object's page list and a ticket-service
		 * token per page, and those hooks live in the host app. Admin-core has no equivalent, so a
		 * block that leaves this unset falls back to the flat IIIF detail image.
		 * https://meemoo.atlassian.net/browse/ARC-3813
		 */
		iiifViewer?: FC<IiifViewerConfigProps>;
		buttonTypes: () => { label: string; value: string }[];
		enableMultiLanguage: boolean;
	};
	// biome-ignore lint/suspicious/noExplicitAny: todo
	content_blocks: Partial<Record<ContentBlockType, FunctionComponent<any>>>;
	icon?: IconConfig;
	alertIcon?: IconConfig;
	handlers: {
		onExternalLink: (url: string) => void;
		/**
		 * Called when an ie-object in a content block starts playing, automatically or manually,
		 * once per player. The consuming app decides whether and how to track that - the
		 * admin-core does no analytics. Optional, so an app that tracks no plays needs no handler.
		 */
		onIeObjectPlay?: (info: IeObjectPlayInfo) => void;
	};
	users?: {
		bulkActions?: UserBulkAction[];
		getCommonUser: () => AvoUserCommonUser | null;
	};
	database: {
		proxyUrl: string;
		// Value is empty for clients that use this config, but it is set for running the admin-core demo app
		// So we can make a distinction between the admin-core-api endpoint and the proxy endpoint
		adminCoreApiUrl?: string;
	};
	routes: {
		ADMIN_DASHBOARD: string;
		ADMIN_CONTENT_PAGE_CREATE: string;
		ADMIN_CONTENT_PAGE_DETAIL: string;
		ADMIN_CONTENT_PAGE_EDIT: string;
		ADMIN_CONTENT_PAGE_LABEL_CREATE: string;
		ADMIN_CONTENT_PAGE_LABEL_DETAIL: string;
		ADMIN_CONTENT_PAGE_LABEL_EDIT: string;
		ADMIN_CONTENT_PAGE_LABEL_OVERVIEW: string;
		ADMIN_CONTENT_PAGE_OVERVIEW: string;
		ADMIN_NAVIGATION_CREATE: string;
		ADMIN_NAVIGATION_DETAIL: string;
		ADMIN_NAVIGATION_ITEM_CREATE: string;
		ADMIN_NAVIGATION_ITEM_EDIT: string;
		ADMIN_NAVIGATION_OVERVIEW: string;
		ADMIN_TRANSLATIONS_OVERVIEW: string;
		ADMIN_USER_DETAIL: string;
		ADMIN_USER_EDIT: string;
		ADMIN_USER_GROUP_CREATE: string;
		ADMIN_USER_GROUP_DETAIL: string;
		ADMIN_USER_GROUP_EDIT: string;
		ADMIN_USER_GROUP_OVERVIEW: string;
		ADMIN_USER_OVERVIEW: string;
		ADMIN_MAINTENANCE_ALERTS_OVERVIEW: string;

		// Optional values only needed for avo
		BUNDLE_DETAIL?: string;
		BUNDLE_EDIT?: string;
		ADMIN_COLLECTIONS_OVERVIEW?: string;
		ADMIN_BUNDLES_OVERVIEW?: string;
		ADMIN_ASSIGNMENTS_OVERVIEW?: string;
		ADMIN_ASSIGNMENT_PUPIL_COLLECTIONS_OVERVIEW?: string;
		COLLECTION_DETAIL?: string;
		ASSIGNMENT_DETAIL?: string;
		ITEM_DETAIL?: string;
		NEWS?: string;
		SEARCH?: string;
	};
	locale: Locale;
	env: {
		LDAP_DASHBOARD_PEOPLE_URL?: string;
		CLIENT_URL: string;
		DATABASE_APPLICATION_TYPE: AvoCoreDatabaseType;
	};
}

/**
 * What the injected IIIF viewer is handed. The page and overlay state, and a ticket-service token
 * per page, stay the host's to resolve -- a ticket is short-lived and access-checked at request
 * time, so it can never be handed over already resolved. The page list itself is optional: a
 * caller that already has it (e.g. from the driekeuzespeler's own proactive fetch) passes it along
 * so the host can skip re-fetching the object just to rebuild a list it already had; a caller with
 * only an id leaves it undefined and the host resolves it the way it always has.
 * https://meemoo.atlassian.net/browse/ARC-3813
 */
export interface IiifViewerConfigProps {
	schemaIdentifier: string;
	/** Names the viewer for assistive technology, since the object title lives outside it. */
	title?: string;
	/** Every page's raw (un-ticketed) image/thumbnail/alto urls, when the caller already has them. */
	pages?: PlayableDisplayIeObjectPage[];
}

/**
 * The icons admin-core renders through the client config. Every client maps each of these onto one
 * of its own icons in `icon.componentProps`, so each client decides what eg: a warning looks like.
 * Never pass a client specific icon name (eg: an avo2 IconName) to the admin-core Icon component,
 * since the other client has no icon by that name.
 */
export enum AdminCoreIconName {
	Add = 'add',
	AngleDown = 'angleDown',
	AngleLeft = 'angleLeft',
	AngleRight = 'angleRight',
	AnglesLeft = 'anglesLeft',
	AnglesRight = 'anglesRight',
	AngleUp = 'angleUp',
	ArrowDown = 'arrowDown',
	ArrowDownRight = 'arrowDownRight',
	ArrowLeft = 'arrowLeft',
	ArrowRight = 'arrowRight',
	ArrowUp = 'arrowUp',
	Audio = 'audio',
	Calendar = 'calendar',
	Check = 'check',
	ChevronLeft = 'chevronLeft',
	Clock = 'clock',
	Collection = 'collection',
	// The fixed icon on the driekeuzespeler's shuffle CTA, "collection-shuffle" in the design.
	// https://meemoo.atlassian.net/browse/ARC-3813
	CollectionShuffle = 'collectionShuffle',
	Copy = 'copy',
	Delete = 'delete',
	Edit = 'edit',
	Export = 'export',
	ExtraOptions = 'extraOptions',
	EyeOff = 'eyeOff',
	File = 'file',
	Filter = 'filter',
	Image = 'image',
	Info = 'info',
	Newspaper = 'newspaper',
	NoAudio = 'noAudio',
	NoFile = 'noFile',
	NoImage = 'noImage',
	NoNewspaper = 'noNewspaper',
	NoVideo = 'noVideo',
	Quotes = 'quotes',
	SortTable = 'sortTable',
	Video = 'video',
	View = 'view',
	Warning = 'warning',
	Play = 'play',
	Pause = 'pause',
}

export interface IconConfig {
	component: ComponentType<{ name: string; className?: string }>;
	componentProps: Record<AdminCoreIconName, IconComponentProps>;
	list: () => { label: string; value: string }[];
	alerts: () => { key: string; label: string; value: string }[];
}

export type IconComponentProps = { name: string } & Record<string, unknown>;

export interface EducationOrganisationService {
	fetchCities(): Promise<string[]>;

	fetchEducationOrganisations(
		city: string | null,
		zipCode: string | null
	): Promise<AvoEducationOrganizationOrganization[]>;

	fetchEducationOrganisationName(organisationId: string, unitId?: string): Promise<string | null>;
}
