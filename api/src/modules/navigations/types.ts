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
