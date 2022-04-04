import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';

import { useConfig } from '../../../shared/hooks';
import { NavigationElement } from '../../types';

export const useUpdateNavigation = (
	options?: UseMutationOptions<NavigationElement[], HTTPError, NavigationElement[]>
): UseMutationResult<NavigationElement[], HTTPError, NavigationElement[]> => {
	const navConfig = useConfig('navigation');
	const navService = navConfig?.service;

	return useMutation((updatedNavigation: NavigationElement[]) => {
		const promises = updatedNavigation.map(async ({ id }) => {
			return navService?.updateById(id) as Promise<NavigationElement>;
		});

		return Promise.all(promises);
	}, options);
};
