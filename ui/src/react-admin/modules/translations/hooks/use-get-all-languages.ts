import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared';
import { TranslationsService } from '~modules/translations/translations.service';
import { LanguageInfo } from '~modules/translations/translations.types';

export const useGetAllLanguages = (): UseQueryResult<LanguageInfo[]> => {
	return useQuery([QUERY_KEYS.GET_ALL_LANGUAGES], () => {
		return TranslationsService.fetchLanguages();
	});
};
