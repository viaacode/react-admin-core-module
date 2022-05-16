import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from 'react-query';
import { Config } from '~core/config';

import { UserGroupUpdates } from '../../types/user-group.types';

export const useUpdateUserGroups = (
	options?: UseMutationOptions<unknown, HTTPError, UserGroupUpdates>
): UseMutationResult<unknown, HTTPError, UserGroupUpdates> => {
	return useMutation(async (json: UserGroupUpdates) => Config.getConfig().services.UserGroupsService.updateUserGroups(json), options);
};
