import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from 'react-query';

import { TRANSLATIONS_QUERY_KEYS } from '../../const';
import { Config } from '~core/config';

export const useGetTranslations = <TData = Record<string, string>>(
	options: UseQueryOptions<
		Record<string, string>,
		HTTPError,
		TData,
		typeof TRANSLATIONS_QUERY_KEYS.all
	> = {
		enabled: true,
	}
) => {
	return useQuery(
		TRANSLATIONS_QUERY_KEYS.all,
		() =>
			Config.getConfig()?.services?.translationsService?.getAll() as Promise<
				Record<string, string>
			>,
		{
			...options,
			enabled: !!options.enabled && !!Config.getConfig()?.services?.translationsService,
		}
	);
};
