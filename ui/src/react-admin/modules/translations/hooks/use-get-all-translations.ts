import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~modules/shared';
import { getFullKey } from '~modules/translations/helpers/get-full-key.ts';
import { TranslationsService } from '~modules/translations/translations.service';

export const useGetAllTranslations = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_ALL_TRANSLATIONS],
		queryFn: async () => {
			const result = await TranslationsService.fetchTranslations();
			return result.map((item) => ({ ...item, id: getFullKey(item) }));
		},
	});
};
