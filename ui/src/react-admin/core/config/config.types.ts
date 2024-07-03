import { LinkTarget } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { DatabaseType } from '@viaa/avo2-types';
import { ComponentType, FC, FunctionComponent, MouseEvent, ReactNode } from 'react';

import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';
import { App, Locale } from '~modules/translations/translations.core.types';

import { UserBulkAction } from '~modules/user/user.types';

import { FlowPlayerWrapperProps } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper';

export enum ToastType {
	ERROR = 'error',
	INFO = 'info',
	SPINNER = 'spinner',
	SUCCESS = 'success',
}

export interface ToastInfo {
	title?: string;
	description?: string;
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
	title?: string;
	children: ReactNode;
	target?: LinkTarget;
}

export type History = ReturnType<AdminConfig['services']['router']['useHistory']>;

export interface AdminConfig {
	// Core module configurations
	flowplayer: {
		FLOW_PLAYER_TOKEN: string;
		FLOW_PLAYER_ID: string;
	};
	staticPages: Record<Locale, string[]>;
	contentPage?: {
		availableContentBlocks: ContentBlockType[];
		defaultPageWidth: ContentWidth;
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
			// Function that returns a history like object with functions push and replace
			useHistory: () => {
				push: (path: string) => void;
				replace: (path: string) => void;
			};

			// A link component, just like <Link to="">click here</Link>
			Link: FunctionComponent<LinkInfo>;
		};
		queryCache: {
			clear: (key: string) => Promise<void>;
		};
	};
	components: {
		loader: {
			component: ComponentType | null;
		};
		defaultAudioStill: string;
		flowplayer?: FC<FlowPlayerWrapperProps>;
		buttonTypes: () => { label: string; value: string }[];
	};
	content_blocks: Partial<Record<ContentBlockType, FunctionComponent<any>>>;
	icon?: IconConfig;
	alertIcon?: IconConfig;
	handlers: {
		onExternalLink: (url: string) => void;
	};
	users?: {
		bulkActions?: UserBulkAction[];
	};
	database: {
		databaseApplicationType: DatabaseType;
		proxyUrl: string;
		// Value is empty for clients that use this config, but it is set for running the admin-core demo app
		// So we can make a distinction between the admin-core-api endpoint and the proxy endpoint
		adminCoreApiUrl?: string;
	};
	routes: {
		ADMIN_ALERTS_OVERVIEW: string;
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
	};
}

export interface IconConfig {
	component: ComponentType<{ name: string; className?: string }>;
	componentProps: {
		add: IconComponentProps;
		angleUp: IconComponentProps;
		angleDown: IconComponentProps;
		angleLeft: IconComponentProps;
		angleRight: IconComponentProps;
		arrowRight: IconComponentProps;
		delete: IconComponentProps;
		extraOptions: IconComponentProps;
		copy: IconComponentProps;
		edit: IconComponentProps;
		view: IconComponentProps;
		filter: IconComponentProps;
		arrowUp: IconComponentProps;
		sortTable: IconComponentProps;
		arrowDown: IconComponentProps;
		chevronLeft: IconComponentProps;
		check: IconComponentProps;
		clock: IconComponentProps;
		calendar: IconComponentProps;
		export: IconComponentProps;
		info: IconComponentProps;
		warning: IconComponentProps;
		eyeOff: IconComponentProps;
		audio: IconComponentProps;
		video: IconComponentProps;
		newspaper: IconComponentProps;
		noAudio: IconComponentProps;
		noVideo: IconComponentProps;
		noFilm: IconComponentProps;
	};
	list: () => { label: string; value: string }[];
	alerts: () => { key: string; label: string; value: string }[];
}

export type IconComponentProps = Record<string, unknown>;

export interface EducationOrganisationService {
	fetchCities(): Promise<string[]>;

	fetchEducationOrganisations(
		city: string | null,
		zipCode: string | null
	): Promise<Avo.EducationOrganization.Organization[]>;

	fetchEducationOrganisationName(organisationId: string, unitId?: string): Promise<string | null>;
}
