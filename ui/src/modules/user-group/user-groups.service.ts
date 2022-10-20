import {
	UserGroupArchief,
	UserGroupUpdateResponse,
	UserGroupUpdates,
} from '~modules/user-group/types/user-group.types';
import { USER_GROUP_SERVICE_BASE_URL } from './user-groups.const';
import { ApiService } from '~modules/shared/services/api-service';

export class UserGroupsService {
	public static async getAllUserGroups(): Promise<UserGroupArchief[]> {
		return await ApiService.getApi().get(USER_GROUP_SERVICE_BASE_URL).json();
	}

	public static async updateUserGroups(
		json: UserGroupUpdates
	): Promise<UserGroupUpdateResponse[]> {
		return await ApiService.getApi().patch(USER_GROUP_SERVICE_BASE_URL, { json }).json();
	}
}
