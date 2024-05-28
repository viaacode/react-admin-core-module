import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { convertDbContentPageToContentPageInfo } from '~modules/content-page/services/content-page.converters';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { Locale } from '~modules/translations/translations.core.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentPageByPath = (
	language: Locale,
	path: string | undefined,
	options?: UseQueryOptions<ContentPageInfo | null, any, ContentPageInfo | null, QUERY_KEYS[]>
) => {
	return useQuery(
		[QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH],
		async () => {
			if (!path) {
				return null;
			}
			const dbContentPage = await ContentPageService.getContentPageByLanguageAndPath(
				language,
				path
			);
			return dbContentPage ? convertDbContentPageToContentPageInfo(dbContentPage) : null;
		},
		options
	);
};
