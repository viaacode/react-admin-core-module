import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useConfig } from '../../../shared/hooks';

export const useDeleteNavigationElement = (
	options?: UseMutationOptions<unknown, HTTPError, string>
): UseMutationResult<unknown, HTTPError, string> => {
	const navConfig = useConfig('navigation');
	const navService = navConfig?.service;

	return useMutation(async (id: string) => navService?.delete(id), options);
};
