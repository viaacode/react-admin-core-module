import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared/index.js';
import { TranslationsService } from '~modules/translations/translations.service.js';
import type { LanguageInfo } from '~modules/translations/translations.types.js';

export const useGetAllLanguages = (): UseQueryResult<LanguageInfo[]> => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_ALL_LANGUAGES],
		queryFn: () => {
			return TranslationsService.fetchLanguages();
		},
	});
};
