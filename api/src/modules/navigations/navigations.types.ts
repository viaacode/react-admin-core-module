import { type Locale } from '../translations';

export enum ContentPickerTypesEnum {
	CONTENT_PAGE = 'CONTENT_PAGE',
	COLLECTION = 'COLLECTION',
	OBJECT = 'OBJECT',
	DROPDOWN = 'DROPDOWN',
	INTERNAL_LINK = 'INTERNAL_LINK',
	EXTERNAL_LINK = 'EXTERNAL_LINK',
	ANCHOR_LINK = 'ANCHOR_LINK',
	PROFILE = 'PROFILE',
	CUSTOM_NAVIGATION_ELEMENTS = 'CUSTOM_NAVIGATION_ELEMENTS',
}

export enum LinkTarget {
	BLANK = '_blank',
	SELF = '_self',
}

export interface NavigationItem {
	id: string;
	label: string;
	placement: string;
	description?: string | null;
	linkTarget: LinkTarget | null;
	iconName: string;
	position: number;
	contentType: string;
	contentPath: string;
	language: Locale;
	tooltip?: string;
	updatedAt: string;
	createdAt: string;
	userGroupIds: string[];
}
