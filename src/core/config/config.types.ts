import { ComponentType } from 'react';

export interface ConfigValue {
	navigation?: {
		// TODO: add service api
	};
	// Secondary services and config
	icon?: {
		component: ComponentType;
		list: { label: string; value: string }[];
	};
	fileService?: FileService;
	[key: string]: unknown;
}

export interface CoreModuleConfig {
	name: string;
}

export interface FileService {
	uploadFile: (file: File) => Promise<unknown>;
	deleteFile: (url: string) => Promise<unknown>;
}
