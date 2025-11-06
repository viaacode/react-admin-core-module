import type { UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { UserGroupService } from '~modules/user-group/services/user-group.service.js';
import type { UserGroupUpdates } from '~modules/user-group/types/user-group.types.js';

export const useUpdateUserGroups = (
	options?: UseMutationOptions<unknown, { deleted: number; updated: number }, UserGroupUpdates>
): UseMutationResult<unknown, { deleted: number; updated: number }, UserGroupUpdates> => {
	return useMutation(async (json: UserGroupUpdates) => {
		return UserGroupService.updateUserGroups(json);
	}, options);
};
