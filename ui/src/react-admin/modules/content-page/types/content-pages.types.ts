import type { Avo } from '@viaa/avo2-types';
import type { Locale } from '~modules/translations/translations.core.types';
import type { PickerItem } from '~shared/types/content-picker';

import type { DateRange } from '~shared/components/DateRangeDropdown/DateRangeDropdown';
import type { FilterableTableState } from '~shared/components/FilterTable/FilterTable';

import type { ContentBlockConfig, DbContentBlock } from './content-block.types';

// Pages
export enum PageType {
	Create = 'create',
	Edit = 'edit',
}

export enum PublishOption {
	private = 'private',
	public = 'public',
	timebound = 'timebound',
}

export enum ContentWidth {
	MEDIUM = 'MEDIUM', // 720
	LARGE = 'LARGE', // 940
	EXTRA_LARGE = 'EXTRA_LARGE', // 1300
}

// Content Overview
export type ContentOverviewTableCols =
	| 'title'
	| 'contentType'
	| 'userProfileId'
	| 'authorUserGroup'
	| 'createdAt'
	| 'updatedAt'
	| 'isPublic'
	| 'translations'
	| 'publishedAt'
	| 'publishAt'
	| 'depublishAt'
	| 'labels'
	| 'userGroupIds'
	| 'actions';

export const NOT_TRANSLATION_PREFIX = 'NOT_';

// NL, EN, NOT_NL, NOT_EN
export type TranslationFilterValue = Locale | `${typeof NOT_TRANSLATION_PREFIX}${Locale}`;

export interface ContentTableState extends FilterableTableState {
	contentType: string[];
	createdAt: DateRange;
	updatedAt: DateRange;
	publishAt: DateRange;
	depublishAt: DateRange;
	userGroup: number[];
	labels: number[];
	isPublic: string[];
	translations: TranslationFilterValue;
}

export interface ContentPageLabel {
	id: number;
	label: string;
	content_type: Avo.ContentPage.Type;
	language: Locale;
	link_to: PickerItem | null;
	created_at: string;
	updated_at: string;
}

interface ContentPageBase {
	id: number | string;
	thumbnailPath: string | null;
	title: string;
	language: Locale;
	nlParentPageId: string | number | null; // number is still used by avo, but we want to switch to uuids at some point
	description_state?: any | undefined; // Only used during interaction with rich text editor
	description: string | null;
	seoDescription: string | null;
	metaDescription: string | null;
	path: string | null;
	isPublic: boolean;
	publishedAt: string | null;
	publishedAtDisplay: string | null; // Contains an override date for when this page is published, this date should be displayed as the publish date instead of the actual publish date
	publishAt: string | null;
	depublishAt: string | null;
	createdAt: string;
	updatedAt: string | null;
	isProtected: boolean;
	contentType: Avo.ContentPage.Type;
	contentWidth: ContentWidth;
	owner: ContentPageUser;
	userProfileId: string | null;
	userGroupIds: string[] | null;
	labels: ContentPageLabel[];
	translatedPages: Pick<ContentPageBase, 'id' | 'title' | 'path' | 'language' | 'isPublic'>[]; // Other pages that are translated versions of this page
}

/**
 * Content page format like we use it inside the admin-core-ui
 * Contains extra info inside the content blocks: ContentBlockConfig
 */
export interface ContentPageInfo extends ContentPageBase {
	content_blocks: ContentBlockConfig[];
}

/**
 * Content page format as we receive it from the admin-core-api endpoints
 * Contains only info that needs to be saved inside the database inside the blocks: DbContentBlock
 */
export interface DbContentPage extends ContentPageBase {
	content_blocks: DbContentBlock[];
}

export interface ContentPageUser {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	groupId: string | number;
	groupName: string;
}

export type ContentEditFormErrors = Partial<{ [key in keyof ContentPageInfo]: string }> & {
	description?: string;
};

export enum ContentEditActionType {
	SET_CONTENT_PAGE = '@@admin-content-page/SET_CONTENT_PAGE',
	SET_CONTENT_PAGE_PROP = '@@admin-content-page/SET_CONTENT_PAGE_PROP',
	ADD_CONTENT_BLOCK_CONFIG = '@@admin-content-edit/ADD_CONTENT_BLOCK_CONFIG',
	REMOVE_CONTENT_BLOCK_CONFIG = '@@admin-content-edit/REMOVE_CONTENT_BLOCK_CONFIG',
	REORDER_CONTENT_BLOCK_CONFIG = '@@admin-content-edit/REORDER_CONTENT_BLOCK_CONFIG',
	ADD_COMPONENTS_STATE = '@@admin-content-edit/ADD_COMPONENTS_STATE',
	SET_COMPONENTS_STATE = '@@admin-content-edit/SET_COMPONENTS_STATE',
	REMOVE_COMPONENTS_STATE = '@@admin-content-edit/REMOVE_COMPONENTS_STATE',
	SET_BLOCK_STATE = '@@admin-content-edit/SET_BLOCK_STATE',
	SET_CONTENT_BLOCK_ERROR = '@@admin-content-edit/SET_CONTENT_BLOCK_ERROR',
}

export type BlockClickHandler = (position: number, type: 'preview' | 'sidebar') => void;

export enum ContentPageAction {
	duplicate = 'duplicate',
	gotoEnglishPage = 'gotoEnglishPage',
	duplicateForEnglish = 'duplicateForEnglish',
	delete = 'delete',
}
