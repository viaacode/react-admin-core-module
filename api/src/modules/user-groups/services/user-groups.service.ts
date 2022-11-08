import { Injectable } from '@nestjs/common';
import { DataService } from '../../data';
import { GetUserGroupsPermissionsQuery } from '../../shared/generated/graphql-db-types-hetarchief';

import { UpdatePermission } from '../dto/user-groups.dto';
import { UserGroupsResponse } from '../user-groups.types';
import { USER_GROUP_QUERIES, UserGroupQueryTypes } from '../user-groups.consts';

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
		const response = await this.dataService.execute<
			UserGroupQueryTypes['GetUserGroupsPermissionsQuery']
		>(
			USER_GROUP_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.GetUserGroupsQuery,
		);

		const userGroups =
			(response as UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo'])
				.users_groups ||
			(
				response as UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']
			).users_group;
		return userGroups.map((userGroup) => this.adapt(userGroup));
	}

	public async updateUserGroups(
		updates: UpdatePermission[],
	): Promise<{ deleted: number; inserted: number }> {
		const response = await this.dataService.execute<
			UserGroupQueryTypes['UpdateUserGroupsPermissionsMutation'],
			UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationVariables']
		>(
			USER_GROUP_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.UpdateUserGroupsPermissionsDocument,
			{
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
			},
		);

		return {
			deleted:
				(
					response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationAvo']
				).delete_users_group_permissions?.affected_rows ||
				(
					response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationHetArchief']
				).delete_users_group_permission?.affected_rows ||
				0,
			inserted:
				(
					response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationAvo']
				).insert_users_group_permissions?.affected_rows ||
				(
					response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationHetArchief']
				).insert_users_group_permission?.affected_rows ||
				0,
		};
	}
}
