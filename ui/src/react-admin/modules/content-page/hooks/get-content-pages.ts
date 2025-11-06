import { useQuery } from '@tanstack/react-query';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageService } from '~modules/content-page/services/content-page.service.js';
import type { ContentOverviewTableCols } from '~modules/content-page/types/content-pages.types.js';
import { QUERY_KEYS } from '~shared/types/index.js';

interface ContentPageOverviewParams {
	page: number;
	sortColumn: ContentOverviewTableCols;
	sortOrder: Avo.Search.OrderDirection;
	tableColumnDataType: string;
	// biome-ignore lint/suspicious/noExplicitAny: todo
	where: any;
}

export const useGetContentPages = (contentPageOverviewParams?: ContentPageOverviewParams) => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, contentPageOverviewParams],
		(props) => {
			const contentPageOverviewParams = props.queryKey[1] as ContentPageOverviewParams;
			if (!contentPageOverviewParams) {
				return null;
			}
			return ContentPageService.fetchContentPages(
				contentPageOverviewParams.page,
				contentPageOverviewParams.sortColumn,
				contentPageOverviewParams.sortOrder,
				contentPageOverviewParams.tableColumnDataType,
				contentPageOverviewParams.where || {}
			);
		},
		{
			keepPreviousData: true,
		}
	);
};
