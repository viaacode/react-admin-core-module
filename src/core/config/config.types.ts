import { TableSortingIcons } from '@meemoo/react-components';
import { ComponentType } from 'react';

import { ContentPageConfig } from '~modules/content-page/types/content-pages.types';
import { NavigationConfig } from '~modules/navigation/types';

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
	t: (translationKey: string, variables?: Record<string, string>) => string;
}

export interface ConfigValue {
	// Core module configurations
	navigation?: NavigationConfig;
	contentPage?: ContentPageConfig;
	// Secondary services and config
	services: {
		toastService: ToastService;
		i18n: I18n;
	};
	components: {
		loader: {
			component: ComponentType;
		};
		table: {
			sortingIcons: TableSortingIcons;
		};
	};
	icon?: IconConfig;
	file?: FileConfig;
}

export interface IconConfig {
	component: ComponentType;
	componentProps: {
		add: IconComponentProps;
		angleUp: IconComponentProps;
		angleDown: IconComponentProps;
		delete: IconComponentProps;
		edit: IconComponentProps;
		view: IconComponentProps;
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
