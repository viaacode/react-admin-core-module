import { RenderLinkFunction } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { ContentItemStyle, ContentTabStyle } from '~modules/content-page/components/blocks';
import { PageOverviewOrderOptions } from '~modules/content-page/const/get-page-overview-order-options';
import { Color } from '~modules/content-page/types/content-block.types';
import { ContentTypeAndLabelsValue } from '~shared/components/ContentTypeAndLabelsPicker/ContentTypeAndLabelsPicker';

export interface ContentPageOverviewParams {
	withBlocks: boolean;
	contentType: string;
	// Visible tabs in the page overview component for which we should fetch item counts
	labelIds: number[];
	// Selected tabs for which we should fetch content page items
	selectedLabelIds: number[];
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
	showTitle?: boolean;
	showDescription?: boolean;
	showDate?: boolean;
	buttonLabel?: string;
	buttonAltTitle?: string;
	itemsPerPage?: number;
	sortOrder?: PageOverviewOrderOptions;
	headerBackgroundColor: Color;
	renderLink: RenderLinkFunction;
}
