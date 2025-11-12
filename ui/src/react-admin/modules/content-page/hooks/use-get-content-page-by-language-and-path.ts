import { useQuery } from '@tanstack/react-query';
import { convertDbContentPageToContentPageInfo } from '~modules/content-page/services/content-page.converters.js';
import { ContentPageService } from '~modules/content-page/services/content-page.service.js';
import type { Locale } from '~modules/translations/translations.core.types.js';
import { QUERY_KEYS } from '~shared/types/index.js';

export const useGetContentPageByLanguageAndPath = (
	language: Locale,
	path: string,
	options: { enabled?: boolean } = {
		enabled: true,
	}
) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_PROFILES, language, path],
		queryFn: async (props) => {
			const language = props.queryKey[1] as Locale;
			const path = props.queryKey[2];
			if (!language || !path) {
				return null;
			}
			const dbContentPage = await ContentPageService.getContentPageByLanguageAndPath(
				language,
				path,
				false
			);
			return dbContentPage ? convertDbContentPageToContentPageInfo(dbContentPage) : null;
		},
		enabled: true,
		...options,
	});
};
