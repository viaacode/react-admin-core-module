import { useQuery } from '@tanstack/react-query';
import { UseQueryOptions } from '@tanstack/react-query/src/types';
import type { Avo } from '@viaa/avo2-types';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { QUERY_KEYS } from '~shared/types';

interface ContentPagesOverviewArgs {
	withBlocks: boolean;
	contentType: Avo.ContentPage.Type;
	labelIds: string[] | number[];
	selectedLabelIds: string[] | number[];
	orderProp: string;
	orderDirection: Avo.Search.OrderDirection;
	offset: number;
	limit: number;
}

export const useGetContentPagesOverview = (
	requestArgs: ContentPagesOverviewArgs,
	options?: UseQueryOptions<any>
) => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, requestArgs],
		(props) => {
			return ContentPageService.getContentPages(
				props.queryKey[1] as ContentPagesOverviewArgs
			);
		},
		options as any
	);
};
