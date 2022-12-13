import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CONTENT_PAGE_QUERY_KEYS } from '~modules/content-page/const/content-page.consts';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';

export const useGetContentPageByPath = (
	path: string | undefined,
	options?: UseQueryOptions<
		ContentPageInfo | null,
		HTTPError,
		ContentPageInfo | null,
		(typeof CONTENT_PAGE_QUERY_KEYS.getContentPageByPath)[]
	>
) => {
	return useQuery(
		[CONTENT_PAGE_QUERY_KEYS.getContentPageByPath],
		() => {
			if (!path) {
				return null;
			}
			return ContentPageService.getContentPageByPath(path);
		},
		options
	);
};
