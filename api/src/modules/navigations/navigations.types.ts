import { type LanguageCode } from '../translations';

import { type NavigationQueryTypes } from './queries/navigation.queries';

export type GqlNavigation =
	| NavigationQueryTypes['GetNavigationBarsQueryAvo']['app_content_nav_elements'][0]
	| NavigationQueryTypes['GetNavigationBarsQueryHetArchief']['app_navigation'][0];

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

export interface NavigationItem {
	id: string;
	label: string;
	placement: string;
	description?: string | null;
	linkTarget?: string | null;
	iconName: string;
	position: number;
	contentType: string;
	contentPath: string;
	language: LanguageCode;
	tooltip?: string;
	updatedAt: string;
	createdAt: string;
	userGroupIds: string[];
}
