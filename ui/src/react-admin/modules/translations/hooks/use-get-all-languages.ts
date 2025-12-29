import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared';
import { TranslationsService } from '~modules/translations/translations.service';
import type { LanguageInfo } from '~modules/translations/translations.types';

export const useGetAllLanguages = (): UseQueryResult<LanguageInfo[]> => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_ALL_LANGUAGES],
		queryFn: () => {
			return TranslationsService.fetchLanguages();
		},
	});
};
