import { Injectable } from '@nestjs/common';
import { AvoOrHetArchief } from '../../content-pages';
import { DataService } from '../../data';

import { UpdatePermission } from '../dto/user-groups.dto';
import { UserGroupWithPermissions } from '../user-groups.types';
import { USER_GROUP_QUERIES, UserGroupQueryTypes } from '../user-groups.consts';

@Injectable()
export class UserGroupsService {
	constructor(private dataService: DataService) {}

	public adapt(
		userGroup:
			| UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo']['users_groups'][0]
			| UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']['users_group'][0],
	): UserGroupWithPermissions {
		const avoUserGroup =
			userGroup as UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo']['users_groups'][0];
		const hetArchiefUserGroup =
			userGroup as UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']['users_group'][0];
		return {
			id: userGroup.id,
			label: userGroup.label,
			name: avoUserGroup.label || hetArchiefUserGroup.name,
			permissions: (
				avoUserGroup.group_permissions || hetArchiefUserGroup.permissions
			).map((permissionWrap) => ({
				id: permissionWrap.permission.id,
				label: permissionWrap.permission.label,
				name: permissionWrap.permission.name,
				description: permissionWrap.permission.description,
			})),
		};
	}

	public async getUserGroups(): Promise<UserGroupWithPermissions[]> {
		const response = await this.dataService.execute<
			UserGroupQueryTypes['GetUserGroupsPermissionsQuery']
		>(
			USER_GROUP_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.GetUserGroupsPermissionsDocument,
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
						.map((update) => {
							if (
								process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.avo
							) {
								return {
									user_group_id: { _eq: parseInt(update.userGroupId) },
									permission_id: { _eq: update.permissionId },
								};
							} else {
								return {
									group_id: { _eq: update.userGroupId },
									permission_id: { _eq: update.permissionId },
								};
							}
						}),
				},
				insertions: updates
					.filter((update) => update.hasPermission)
					.map((update) => {
						if (process.env.DATABASE_APPLICATION_TYPE === AvoOrHetArchief.avo) {
							return {
								user_group_id: parseInt(update.userGroupId),
								permission_id: update.permissionId,
							};
						} else {
							return {
								group_id: update.userGroupId,
								permission_id: update.permissionId,
							};
						}
					}),
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
