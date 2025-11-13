import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { convertDbContentPageToContentPageInfo } from '~modules/content-page/services/content-page.converters';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import type { ContentPageInfo } from '~modules/content-page/types/content-pages.types';
import type { Locale } from '~modules/translations/translations.core.types';
import { QUERY_KEYS } from '~shared/types/index';

export const useGetContentPageByPath = (
	language: Locale,
	path: string | undefined,
	options?: UseQueryOptions<
		ContentPageInfo | null,
		// biome-ignore lint/suspicious/noExplicitAny: todo
		any,
		ContentPageInfo | null,
		QUERY_KEYS[]
	>
) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH],
		queryFn: async () => {
			if (!path) {
				return null;
			}
			const dbContentPage = await ContentPageService.getContentPageByLanguageAndPath(
				language,
				path
			);
			return dbContentPage ? convertDbContentPageToContentPageInfo(dbContentPage) : null;
		},
		...options,
	});
};
