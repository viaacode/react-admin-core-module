import { RichEditorState } from '@meemoo/react-components';
import { Avo } from '@viaa/avo2-types';

import { DateRange } from '../../shared/components/DateRangeDropdown/DateRangeDropdown';
import { FilterableTableState } from '../../shared/components/FilterTable/FilterTable';

import { ContentBlockConfig } from './content-block.types';
import { CommonUser, ProfileAvo, ProfileHetArchief } from '~modules/user/user.types';
import { ContentBlockSchema } from '@viaa/avo2-types/types/content-blocks';
import {
	ContentPageLabelLinkSchema,
	ContentWidthSchema,
} from '@viaa/avo2-types/types/content-page';

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
	MEDIUM = 'MEDIUM',
	LARGE = 'LARGE',
	REGULAR = 'REGULAR',
}

// Content Overview
export type ContentOverviewTableCols =
	| 'title'
	| 'content_type'
	| 'user_profile_id'
	| 'author_user_group'
	| 'created_at'
	| 'updated_at'
	| 'is_public'
	| 'published_at'
	| 'publish_at'
	| 'depublish_at'
	| 'labels'
	| 'user_group_ids'
	| 'actions';

export interface ContentTableState extends FilterableTableState {
	content_type: string[];
	created_at: DateRange;
	updated_at: DateRange;
	publish_at: DateRange;
	depublish_at: DateRange;
	user_group: number[];
	labels: number[];
}

// Content Detail
export interface ContentPageDb {
	id: number;
	thumbnail_path: string | null;
	title: string;
	description: string | null;
	seo_description: string | null;
	meta_description: string | null;
	path: string | null;
	is_public: boolean;
	published_at: string;
	publish_at: string | null;
	depublish_at: string | null;
	created_at: string;
	updated_at: string | null;
	is_protected: boolean;
	content_type: string;
	content_width: ContentWidthSchema;
	profile: ProfileAvo | ProfileHetArchief;
	user_profile_id: string | null;
	user_group_ids: number[] | null;
	content_blocks: ContentBlockSchema[];
	content_content_labels: ContentPageLabelLinkSchema[];
}

/**
 * Convenience type with certain fields converted to be easier to manipulate
 * eg:
 * - contentBlockConfigs: ContentBlockConfig[]; instead of content_blocks: ContentBlockSchema[];
 * - labels: Avo.ContentPage.Label[] instead of content_content_labels: ContentLabelLinkSchema[];
 */

export interface ContentPageInfo {
	id: number | string; // Numeric ids in avo, uuid's in hetarchief. We would like to switch to uuids for avo as well at some point
	thumbnail_path: string | null;
	title: string;
	description_html: string | null;
	description_state: RichEditorState | undefined;
	seo_description: string | null;
	meta_description: string | null; // Used for klaar newsletter description
	path: string | null;
	is_public: boolean;
	published_at: string | null;
	publish_at: string | null;
	depublish_at: string | null;
	created_at: string;
	updated_at: string | null;
	is_protected: boolean;
	content_type: Avo.ContentPage.Type;
	content_width: Avo.ContentPage.Width;
	profile: CommonUser;
	user_profile_id: string | null;
	user_group_ids: number[] | null;
	contentBlockConfigs: ContentBlockConfig[];
	labels: Partial<Avo.ContentPage.Label>[];
}

export type ContentPageDetailParams = { id: string };

export type ContentEditFormErrors = Partial<{ [key in keyof ContentPageInfo]: string }>;

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

export interface ContentPageOverviewCellProps {
	row: {
		original: ContentPageInfo;
	};
}
