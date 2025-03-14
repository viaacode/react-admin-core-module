import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared';
import { TranslationsService } from '~modules/translations/translations.service';
import type { MultiLanguageTranslationEntry } from '~modules/translations/translations.types';

export const useGetAllTranslations = (): UseQueryResult<MultiLanguageTranslationEntry[]> => {
	return useQuery([QUERY_KEYS.GET_ALL_TRANSLATIONS], () => {
		return TranslationsService.fetchTranslations();
	});
};
