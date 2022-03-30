import { TableSortingIcons } from '@meemoo/react-components';
import { ComponentType } from 'react';

import { NavigationConfig } from '../../modules/navigation/types';

export interface ConfigValue {
	// Core module configurations
	navigation?: NavigationConfig;
	// Secondary services and config
	components?: {
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
