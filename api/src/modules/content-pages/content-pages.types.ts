import type { Avo } from '@viaa/avo2-types';

import { type Media } from '../media/media.types';
import { type LinkTarget } from '../navigations';
import {
	type GetContentByIdQuery as GetContentByIdQueryAvo,
	type GetContentPageByPathQuery as GetContentPageByPathQueryAvo,
	type GetContentPagesQuery as GetContentPagesQueryAvo,
	type GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryAvo,
	Lookup_Enum_Content_Types_Enum,
} from '../shared/generated/graphql-db-types-avo';
import {
	type GetContentByIdQuery as GetContentByIdQueryHetArchief,
	type GetContentPageByPathQuery as GetContentPageByPathQueryHetArchief,
	type GetContentPagesQuery as GetContentPagesQueryHetArchief,
	type GetContentPagesWithBlocksQuery as GetContentPagesWithBlocksQueryHetArchief,
	Lookup_App_Content_Type_Enum,
} from '../shared/generated/graphql-db-types-hetarchief';
import { type Locale } from '../translations';

import { type DbContentBlock } from './content-block.types';
import { type ContentPageQueryTypes } from './queries/content-pages.queries';

type ContentPickerTypeAvo =
	| 'COLLECTION'
	| 'ITEM'
	| 'BUNDLE'
	| 'DROPDOWN'
	| 'SEARCH_QUERY'
	| 'PROJECTS';

type ContentPickerTypeHetArchief = 'IE_COLLECTION' | 'IE_OBJECT';

export type ContentPickerType =
	| ContentPickerTypeAvo
	| ContentPickerTypeHetArchief
	| 'CONTENT_PAGE'
	| 'INTERNAL_LINK'
	| 'EXTERNAL_LINK'
	| 'ANCHOR_LINK'
	| 'PROFILE';

export interface PickerItem {
	label?: string;
	type: ContentPickerType;
	value: string;
	target?: LinkTarget;
}

export type ContentWidth = 'REGULAR' | 'LARGE' | 'MEDIUM';

export interface ContentPageLabel {
	id: number | string;
	label: string;
	content_type: ContentPageType;
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
	nlParentPageId: number | string;
	description: string | null;
	seoDescription: string | null;
	metaDescription: string | null;
	path: string | null;
	isPublic: boolean;
	publishedAt: string | null;
	publishedAtDisplay: string | null;
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
 * Content page format as we receive it from the admin-core-api endpoints
 * Contains only info that needs to be saved inside the database inside the blocks: DbContentBlock
 */
export interface DbContentPage extends ContentPageBase {
	content_blocks: DbContentBlock[];
}

export type GqlContentPage =
	| GetContentPageByPathQueryAvo['app_content'][0]
	| GetContentPageByPathQueryHetArchief['app_content_page'][0]
	| GetContentPagesQueryAvo['app_content'][0]
	| GetContentPagesQueryHetArchief['app_content_page'][0]
	| GetContentPagesWithBlocksQueryAvo['app_content'][0]
	| GetContentPagesWithBlocksQueryHetArchief['app_content_page'][0];

export type GqlContentBlockAvo =
	GetContentPageByPathQueryAvo['app_content'][0]['content_blocks'][0];
export type GqlContentBlockHetArchief =
	GetContentPageByPathQueryHetArchief['app_content_page'][0]['content_blocks'][0];
export type GqlContentBlock = GqlContentBlockAvo | GqlContentBlockHetArchief;

export type GqlInsertOrUpdateContentPage =
	| ContentPageQueryTypes['InsertContentMutationVariables']['contentPage']
	| ContentPageQueryTypes['UpdateContentPageWithBlocksAndLabelsMutationVariables']['contentPage'];

export type GqlAvoUser =
	| GetContentPageByPathQueryAvo['app_content'][0]['profile']
	| GetContentByIdQueryAvo['app_content'][0]['profile'];
export type GqlHetArchiefUser =
	| GetContentPageByPathQueryHetArchief['app_content_page'][0]['profile']
	| GetContentByIdQueryHetArchief['app_content_page'][0]['profile'];
export type GqlUser = GqlAvoUser | GqlHetArchiefUser;

export interface ContentPageUser {
	id: string;
	fullName: string;
	firstName: string;
	lastName: string;
	groupId: string | number;
	groupName: string;
}

export type ContentPageType = Lookup_App_Content_Type_Enum | Lookup_Enum_Content_Types_Enum;
export const ContentPageTypeValues = {
	...Lookup_App_Content_Type_Enum,
	...Lookup_Enum_Content_Types_Enum,
};

// TODO add these types to the hetarchief hasura migrations after the database rename
// NIEUWS_ITEM = 'NIEUWS_ITEM',
// FAQ_ITEM = 'FAQ_ITEM',
// SCREENCAST = 'SCREENCAST',
// PAGINA = 'PAGINA',
// PROJECT = 'PROJECT',
// OVERZICHT = 'OVERZICHT',

export interface MediaPlayerPathInfo {
	getItemExternalIdPath: string;
	setItemExternalIdPath: string;
	setVideoSrcPath: string;
	setPosterSrcPath: string;
	setTitlePath: string;
	setDescriptionPath: string;
	setIssuedPath: string;
	setOrganisationPath: string;
	setDurationPath: string;
}

export type MediaItemResponse = Partial<Media> & {
	count: number;
};

export type LabelObj = {
	label: string;
	id: number | string;
};

export interface SearchDateRange {
	gte: string | '' | undefined;
	lte: string | '' | undefined;
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
	| 'publishedAt'
	| 'publishAt'
	| 'depublishAt'
	| 'labels'
	| 'userGroupIds';

export interface ContentPagePublishInfo {
	id: number | string;
	publish_at: string | null;
	depublish_at: string | null;
	published_at: string | null;
	published_at_display: string | null;
}

export interface ContentPagesPublishAndUnpublishResults {
	publishedCount: number;
	publishedIds: (number | string)[];
	unpublishedCount: number;
	unpublishedIds: (number | string)[];
}
