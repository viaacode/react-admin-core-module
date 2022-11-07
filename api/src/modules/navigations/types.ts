import {
	FindNavigationByIdQuery,
	InsertNavigationMutation,
	UpdateNavigationByIdMutation,
} from '../shared/generated/graphql-db-types-hetarchief';

export type Navigation =
	| InsertNavigationMutation['insert_app_navigation_one']
	| UpdateNavigationByIdMutation['update_app_navigation_by_pk']
	| FindNavigationByIdQuery['app_navigation'][0];

export enum ContentPickerTypesEnum {
	CONTENT_PAGE = 'CONTENT_PAGE',
	COLLECTION = 'COLLECTION',
	OBJECT = 'OBJECT',
	DROPDOWN = 'DROPDOWN',
	INTERNAL_LINK = 'INTERNAL_LINK',
	EXTERNAL_LINK = 'EXTERNAL_LINK',
	ANCHOR_LINK = 'ANCHOR_LINK',
	PROFILE = 'PROFILE',
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
	tooltip?: string;
	updatedAt: string;
	createdAt: string;
}
