import type { Avo } from '@viaa/avo2-types';
import { DatabaseType } from '@viaa/avo2-types';
import { ComponentType, FC, FunctionComponent, MouseEvent, ReactNode } from 'react';
import { MediaListItem } from '~content-blocks/BlockMediaGrid/BlockMediaGrid';

import { UserBulkAction } from '~modules/user/user.types';

import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';
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
	showToast: (toastInfo: ToastInfo) => void;
}

export interface I18n {
	tHtml: (
		translationKey: string,
		variables?: Record<string, string>,
		apps?: DatabaseType[]
	) => ReactNode | string;
	tText: (
		translationKey: string,
		variables?: Record<string, string>,
		apps?: DatabaseType[]
	) => string;
}

export interface LinkInfo {
	className?: string;
	to?: string;
	onClick?: (evt: MouseEvent) => void;
	title?: string;
	children: ReactNode;
}

export type History = ReturnType<AdminConfig['services']['router']['useHistory']>;

export interface AdminConfig {
	// Core module configurations
	flowplayer: {
		FLOW_PLAYER_TOKEN: string;
		FLOW_PLAYER_ID: string;
	};
	staticPages: string[];
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
		assetService: {
			uploadFile: (
				file: File,
				assetType: Avo.FileUpload.AssetType,
				ownerId: string
			) => Promise<string>;
			deleteFile: (fileUrl: string) => Promise<void>;
		};
		getContentPageByPathEndpoint: string | null;
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
			component: ComponentType;
		};
		flowplayer?: FC<FlowPlayerWrapperProps>;
		buttonTypes: () => { label: string; value: string }[];
	};
	content_blocks: Partial<Record<ContentBlockType, FunctionComponent<any>>>;
	icon?: IconConfig;
	alertIcon?: IconConfig;
	file?: FileConfig;
	handlers: {
		onExternalLink: (url: string) => void;
		mediaItemClicked?: (item: MediaListItem) => void;
	};
	users?: {
		bulkActions?: UserBulkAction[];
	};
	database: {
		databaseApplicationType: DatabaseType;
		proxyUrl: string;
	};
	routes: {
		ALERTS_OVERVIEW: string;
		CONTENT_PAGE_CREATE: string;
		CONTENT_PAGE_DETAIL: string;
		CONTENT_PAGE_EDIT: string;
		CONTENT_PAGE_LABEL_CREATE: string;
		CONTENT_PAGE_LABEL_DETAIL: string;
		CONTENT_PAGE_LABEL_EDIT: string;
		CONTENT_PAGE_LABEL_OVERVIEW: string;
		CONTENT_PAGE_OVERVIEW: string;
		NAVIGATION_CREATE: string;
		NAVIGATION_DETAIL: string;
		NAVIGATION_ITEM_CREATE: string;
		NAVIGATION_ITEM_EDIT: string;
		NAVIGATION_OVERVIEW: string;
		TRANSLATIONS_OVERVIEW: string;
		USER_DETAIL: string;
		USER_EDIT: string;
		USER_GROUP_CREATE: string;
		USER_GROUP_DETAIL: string;
		USER_GROUP_EDIT: string;
		USER_GROUP_OVERVIEW: string;
		USER_OVERVIEW: string;

		// Optional values only needed for avo
		BUNDLE_DETAIL?: string;
		BUNDLE_EDIT?: string;
		COLLECTIONS_OVERVIEW?: string;
		COLLECTION_DETAIL?: string;
		ITEM_DETAIL?: string;
		NEWS?: string;
		SEARCH?: string;
	};
	env: {
		LDAP_DASHBOARD_PEOPLE_URL?: string;
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
	};
	list: () => { label: string; value: string }[];
	alerts: () => { key: string; label: string; value: string }[];
}

export type IconComponentProps = Record<string, unknown>;

export interface FileConfig {
	service: FileService;
}

export interface FileService {
	uploadFile: (file: File) => Promise<unknown>;
	deleteFile: (url: string) => Promise<unknown>;
}

export interface EducationOrganisationService {
	fetchCities(): Promise<string[]>;

	fetchEducationOrganisations(
		city: string | null,
		zipCode: string | null
	): Promise<Avo.EducationOrganization.Organization[]>;

	fetchEducationOrganisationName(organisationId: string, unitId?: string): Promise<string | null>;
}
