import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { convertDbContentPageToContentPageInfo } from '~modules/content-page/services/content-page.converters';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { Locale } from '~modules/translations/translations.core.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentPageByLanguageAndPath = (
	language: Locale,
	path: string,
	options?: UseQueryOptions<any>
) => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, language, path],
		async (props) => {
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
		options as any
	);
};
