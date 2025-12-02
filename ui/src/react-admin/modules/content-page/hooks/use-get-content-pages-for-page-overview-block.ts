import { useQuery } from '@tanstack/react-query';
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

export const useGetContentPagesForPageOverviewBlock = (
	requestArgs: ContentPagesOverviewArgs,
	options: { enabled?: boolean } = {
		enabled: true,
	}
) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_PROFILES, requestArgs],
		queryFn: (props) => {
			return ContentPageService.getContentPagesForPageOverviewBlock(
				props.queryKey[1] as ContentPagesOverviewArgs
			);
		},
		enabled: true,
		...options,
	});
};
