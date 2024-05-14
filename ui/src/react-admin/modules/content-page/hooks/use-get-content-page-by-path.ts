import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentPageByPath = (
	language: LanguageCode,
	path: string,
	options?: UseQueryOptions<any>
) => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, language, path],
		(props) => {
			const language = props.queryKey[1] as LanguageCode;
			const path = props.queryKey[2];
			if (!language || !path) {
				return null;
			}
			return ContentPageService.getContentPageByLanguageAndPath(language, path);
		},
		options as any
	);
};
