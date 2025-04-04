import type { RenderLinkFunction } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import type { PageOverviewOrderOptions } from '~modules/content-page/const/get-page-overview-order-options';
import type { Color } from '~modules/content-page/types/content-block.types';
import type { ContentTypeAndLabelsValue } from '~shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker';

export type ContentTabStyle = 'ROUNDED_BADGES' | 'MENU_BAR';
export enum ContentItemStyle {
	GRID = 'GRID',
	NEWS_LIST = 'NEWS_LIST',
	PROJECT_LIST = 'PROJECT_LIST',
	ACCORDION = 'ACCORDION',
	ACCORDION_TWO_LEVELS = 'ACCORDION_TWO_LEVELS',
}

export type LabelObj = {
	label: string;
	id: number;
};

export interface ContentPageOverviewParams {
	withBlocks: boolean;
	contentType: string;
	// Visible tabs in the page overview component for which we should fetch item counts
	labelIds: number[] | string[]; // Strings for uuid's on hetarchief, and numbers for ids in avo
	// Selected tabs for which we should fetch content page items
	selectedLabelIds: number[] | string[]; // Strings for uuid's on hetarchief, and numbers for ids in avo
	orderProp?: string;
	orderDirection?: Avo.Search.OrderDirection;
	offset: number;
	limit: number;
}

export interface PageOverviewWrapperProps {
	contentTypeAndTabs: ContentTypeAndLabelsValue;
	tabStyle?: ContentTabStyle;
	allowMultiple?: boolean;
	centerHeader?: boolean;
	itemStyle?: ContentItemStyle;
	showSectionTitle?: boolean;
	showTitle?: boolean;
	showDescription?: boolean;
	showDate?: boolean;
	buttonLabel?: string;
	buttonAltTitle?: string;
	itemsPerPage?: number;
	sortOrder?: PageOverviewOrderOptions;
	headerBackgroundColor: Color;
	renderLink: RenderLinkFunction;
	commonUser?: Avo.User.CommonUser;
}
