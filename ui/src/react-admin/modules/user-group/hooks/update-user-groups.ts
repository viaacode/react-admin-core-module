import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service';
import type { UserGroupUpdates } from '~modules/user-group/types/user-group.types';

export const useUpdateUserGroups = (
	options?: UseMutationOptions<unknown, any, UserGroupUpdates>
): UseMutationResult<unknown, any, UserGroupUpdates> => {
	return useMutation(async (json: UserGroupUpdates) => {
		return UserGroupService.updateUserGroups(json);
	}, options);
};
