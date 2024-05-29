import { useQuery, UseQueryOptions } from '@tanstack/react-query';
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
		(props) => {
			const language = props.queryKey[1] as Locale;
			const path = props.queryKey[2];
			if (!language || !path) {
				return null;
			}
			return ContentPageService.getContentPageByLanguageAndPath(language, path);
		},
		options as any
	);
};
