import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { Config } from '~core/config';

export const useUpdateTranslations = (
	options?: UseMutationOptions<Record<string, string>, HTTPError, Record<string, string>>
): UseMutationResult<Record<string, string>, HTTPError, Record<string, string>> => {
	return useMutation((updatedTranslations: Record<string, string>) => {
		return Config.getConfig()?.services?.translationsService?.updateAll(
			updatedTranslations
		) as Promise<Record<string, string>>;
	}, options);
};
