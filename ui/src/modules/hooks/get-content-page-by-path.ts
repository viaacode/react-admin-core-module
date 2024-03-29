import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentPageByPath = (
	path: string | undefined,
	options?: UseQueryOptions<ContentPageInfo | null, any, ContentPageInfo | null, QUERY_KEYS[]>
) => {
	return useQuery(
		[QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH],
		() => {
			if (!path) {
				return null;
			}
			return ContentPageService.getContentPageByPath(path);
		},
		options
	);
};
