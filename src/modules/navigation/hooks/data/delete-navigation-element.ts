import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { Config } from '../../../../core/config';

export const useDeleteNavigationElement = (
	options?: UseMutationOptions<unknown, HTTPError, string>
): UseMutationResult<unknown, HTTPError, string> => {
	const navConfig = Config.getConfig().navigation;
	const navService = navConfig?.service;

	return useMutation(async (id: string) => navService?.delete(id), options);
};
