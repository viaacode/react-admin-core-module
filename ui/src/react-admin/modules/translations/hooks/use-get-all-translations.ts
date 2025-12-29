import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared';
import { TranslationsService } from '~modules/translations/translations.service';

export const useGetAllTranslations = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_ALL_TRANSLATIONS],
		queryFn: () => {
			return TranslationsService.fetchTranslations();
		},
	});
};
