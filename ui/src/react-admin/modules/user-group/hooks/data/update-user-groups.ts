import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { AdminConfigManager } from '~core/config';

import { UserGroupUpdates } from '../../types/user-group.types';

export const useUpdateUserGroups = (
	options?: UseMutationOptions<unknown, HTTPError, UserGroupUpdates>
): UseMutationResult<unknown, HTTPError, UserGroupUpdates> => {
	return useMutation(
		async (json: UserGroupUpdates) =>
			AdminConfigManager.getConfig().services.UserGroupsService.updateUserGroups(json),
		options
	);
};
