import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentPageByPath = (
	language: LanguageCode,
	path: string | undefined,
	options?: UseQueryOptions<ContentPageInfo | null, any, ContentPageInfo | null, QUERY_KEYS[]>
) => {
	return useQuery(
		[QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH],
		() => {
			if (!path) {
				return null;
			}
			return ContentPageService.getContentPageByLanguageAndPath(language, path);
		},
		options
	);
};
