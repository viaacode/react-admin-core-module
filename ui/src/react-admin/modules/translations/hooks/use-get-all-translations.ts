import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared/index.js';
import { TranslationsService } from '~modules/translations/translations.service.js';
import type { MultiLanguageTranslationEntry } from '~modules/translations/translations.types.js';

export const useGetAllTranslations = (): UseQueryResult<MultiLanguageTranslationEntry[]> => {
	return useQuery([QUERY_KEYS.GET_ALL_TRANSLATIONS], () => {
		return TranslationsService.fetchTranslations();
	});
};
