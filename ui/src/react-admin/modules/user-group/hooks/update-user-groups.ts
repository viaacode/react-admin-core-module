import { HTTPError } from 'ky';
import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import { UserGroupUpdates } from '~modules/user-group/types/user-group.types';

export const useUpdateUserGroups = (
	options?: UseMutationOptions<unknown, HTTPError, UserGroupUpdates>
): UseMutationResult<unknown, HTTPError, UserGroupUpdates> => {
	return useMutation(async (json: UserGroupUpdates) => {
		return UserGroupService.updateUserGroups(json);
	}, options);
};
