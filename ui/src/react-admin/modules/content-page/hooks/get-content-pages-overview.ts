import type { Avo } from '@viaa/avo2-types';
import type { HTTPError } from 'ky';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CONTENT_PAGE_QUERY_KEYS } from '~modules/content-page/const/content-page.consts';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import {
	ContentOverviewTableCols,
	ContentPageInfo,
} from '~modules/content-page/types/content-pages.types';

export const useGetContentPagesOverview = <TData = [ContentPageInfo[], number]>(
	page: number,
	sortColumn: ContentOverviewTableCols,
	sortOrder: Avo.Search.OrderDirection,
	columnDataType: string,
	where: any
): UseQueryResult<TData, HTTPError> => {
	return useQuery(
		[CONTENT_PAGE_QUERY_KEYS.OVERVIEW, { page, sortColumn, sortOrder, columnDataType, where }],
		() => {
			return ContentPageService.fetchContentPages(
				page,
				sortColumn,
				sortOrder,
				columnDataType,
				where
			);
		}
	);
};
