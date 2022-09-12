import { TableSortingIcons } from '@meemoo/react-components';
import { Avo } from '@viaa/avo2-types';
import { ComponentType, FunctionComponent, MouseEvent, ReactNode } from 'react';

import { AvoOrHetArchief } from '~modules/shared/types';

import {
	UserGroupArchief,
	UserGroupUpdateResponse,
	UserGroupUpdates,
} from '~modules/user-group/types/user-group.types';
import { CommonUser, UserBulkAction } from '~modules/user/user.types';

import { PermissionData } from '~modules/permissions/types/permissions.types';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import { NavigationItem } from '~modules/navigation/navigation.types';
import { ContentPageInfo, ContentWidth } from '~modules/content-page/types/content-pages.types';

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

export interface NavigationsService {
	getAllNavigationBars: () => Promise<NavigationItem[]>;
	createNavigationItem: (navigationItem: NavigationItem) => Promise<NavigationItem>;
}

export interface I18n {
	t: (translationKey: string, variables?: Record<string, string>) => string;
}

export interface UserGroupsService {
	getAllUserGroups: () => Promise<UserGroupArchief[]>;
	updateUserGroups: (json: UserGroupUpdates) => Promise<UserGroupUpdateResponse[]>;
}

export interface PermissionsService {
	getAllPermissions: () => Promise<PermissionData[]>;
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
		toastService: ToastService;
		i18n: I18n;
		educationOrganisationService: EducationOrganisationService;
		router: {
			// Function that returns a history like object with functions push and replace
			useHistory: () => {
				push: (path: string) => void;
				replace: (path: string) => void;
			};

			// Function that returns the params for the current url
			useParams: () => Record<string, string>;

			// A link component, just like <Link to="">click here</Link>
			Link: FunctionComponent<LinkInfo>;
		};
		UserGroupsService: UserGroupsService;
		PermissionsService: PermissionsService;
		queryCache: {
			clear: (key: string) => Promise<void>;
		};
	};
	components: {
		loader: {
			component: ComponentType;
		};
		table: {
			sortingIcons: TableSortingIcons;
		};
		buttonTypes: () => { label: string; value: string }[];
	};
	icon?: IconConfig;
	file?: FileConfig;
	handlers: {
		onExternalLink: (url: string) => void;
	};
	users?: {
		bulkActions?: UserBulkAction[];
	};
	database: {
		databaseApplicationType: AvoOrHetArchief;
		proxyUrl: string;
		graphqlUrl: string;
		graphqlSecret: string;
	};
	user: CommonUser;
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
		edit: IconComponentProps;
		view: IconComponentProps;
		filter: IconComponentProps;
		arrowUp: IconComponentProps;
		sortTable: IconComponentProps;
		arrowDown: IconComponentProps;
	};
	list: { label: string; value: string }[];
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
