import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/services/data.service';
import {
	GetUserGroupsPermissionsDocument,
	GetUserGroupsPermissionsQuery,
	UpdateUserGroupsPermissionsDocument,
	UpdateUserGroupsPermissionsMutation,
	UpdateUserGroupsPermissionsMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';

import { UpdatePermission } from '../dto/user-groups.dto';
import { UserGroupsResponse } from '../types';

@Injectable()
export class UserGroupsService {
	constructor(private dataService: DataService) {}

	public adapt(
		userGroup: GetUserGroupsPermissionsQuery['users_group'][0],
	): UserGroupsResponse {
		return {
			id: userGroup.id,
			label: userGroup.label,
			name: userGroup.name,
			permissions: userGroup.permissions.map((permissionWrap) => ({
				id: permissionWrap.permission.id,
				label: permissionWrap.permission.label,
				name: permissionWrap.permission.name,
				description: permissionWrap.permission.description,
			})),
		};
	}

	public async getUserGroups(): Promise<UserGroupsResponse[]> {
		const response =
			await this.dataService.execute<GetUserGroupsPermissionsQuery>(
				GetUserGroupsPermissionsDocument,
			);

		return response.users_group.map((userGroup) => this.adapt(userGroup));
	}

	public async updateUserGroups(
		updates: UpdatePermission[],
	): Promise<{ deleted: number; inserted: number }> {
		const response = await this.dataService.execute<
			UpdateUserGroupsPermissionsMutation,
			UpdateUserGroupsPermissionsMutationVariables
		>(UpdateUserGroupsPermissionsDocument, {
			deletions: {
				_or: updates
					.filter((update) => !update.hasPermission)
					.map((update) => ({
						_and: [
							{ permission_id: { _eq: update.permissionId } },
							{ group_id: { _eq: update.userGroupId } },
						],
					})),
			},
			insertions: updates
				.filter((update) => update.hasPermission)
				.map((update) => ({
					group_id: update.userGroupId,
					permission_id: update.permissionId,
				})),
		});

		return {
			deleted: response.delete_users_group_permission?.affected_rows || 0,
			inserted: response.insert_users_group_permission?.affected_rows || 0,
		};
	}
}
