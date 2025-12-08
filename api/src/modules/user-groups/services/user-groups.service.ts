import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { sortBy } from 'lodash';

import { DataService } from '../../data';
import { getDatabaseType } from '../../shared/helpers/get-database-type';
import { isAvo } from '../../shared/helpers/is-avo';
import { UpdatePermission } from '../dto/user-groups.dto';
import { USER_GROUP_QUERIES, UserGroupQueryTypes } from '../queries/user-groups.queries';
import { USER_GROUP_ORDER } from '../user-groups.consts';
import { UserGroupWithPermissions } from '../user-groups.types';

@Injectable()
export class UserGroupsService {
	constructor(@Inject(forwardRef(() => DataService)) protected dataService: DataService) {}

	public adapt(
		userGroup:
			| UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo']['users_groups'][0]
			| UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']['users_group'][0]
			| UserGroupQueryTypes['GetUserGroupsQueryAvo']['users_groups'][0]
			| UserGroupQueryTypes['GetUserGroupsQueryHetArchief']['users_group'][0]
	): UserGroupWithPermissions {
		const avoUserGroup =
			userGroup as UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo']['users_groups'][0];
		const hetArchiefUserGroup =
			userGroup as UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']['users_group'][0];
		return {
			id: userGroup.id,
			label: userGroup.label,
			name: avoUserGroup.label || hetArchiefUserGroup.name,
			permissions: (avoUserGroup.group_permissions || hetArchiefUserGroup.permissions || []).map(
				(permissionWrap) => ({
					id: permissionWrap.permission.id,
					label: permissionWrap.permission.label,
					name: permissionWrap.permission.name,
					description: permissionWrap.permission.description,
				})
			),
		};
	}

	/**
	 * sort the user groups in a specific order
	 * https://meemoo.atlassian.net/browse/ARC-1999
	 * // TODO replace this with a "display_order" column in the database at some point
	 * @param userGroups
	 */
	private customSortUserGroups = <T extends { label: string }>(userGroups: T[]): T[] => {
		return sortBy(userGroups, (userGroup) => {
			const label = userGroup.label.toLowerCase();
			const index = USER_GROUP_ORDER.findIndex((userGroupName) => userGroupName === label);

			return `${String(index).padStart(2, '0')}-${label}`;
		});
	};

	public async getUserGroups(withPermissions: boolean): Promise<UserGroupWithPermissions[]> {
		if (withPermissions) {
			const response = await this.dataService.execute<
				UserGroupQueryTypes['GetUserGroupsPermissionsQuery']
			>(USER_GROUP_QUERIES[getDatabaseType()].GetUserGroupsPermissionsDocument);

			const userGroups =
				(response as UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo']).users_groups ||
				(response as UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']).users_group;

			const sortedUserGroups = this.customSortUserGroups<
				| UserGroupQueryTypes['GetUserGroupsPermissionsQueryAvo']['users_groups'][0]
				| UserGroupQueryTypes['GetUserGroupsPermissionsQueryHetArchief']['users_group'][0]
			>(userGroups);

			return sortedUserGroups.map((userGroup) => this.adapt(userGroup));
		} else {
			const response = await this.dataService.execute<UserGroupQueryTypes['GetUserGroupsQuery']>(
				USER_GROUP_QUERIES[getDatabaseType()].GetUserGroupsDocument
			);

			const userGroups =
				(response as UserGroupQueryTypes['GetUserGroupsQueryAvo']).users_groups ||
				(response as UserGroupQueryTypes['GetUserGroupsQueryHetArchief']).users_group;

			const sortedUserGroups = this.customSortUserGroups<
				| UserGroupQueryTypes['GetUserGroupsQueryAvo']['users_groups'][0]
				| UserGroupQueryTypes['GetUserGroupsQueryHetArchief']['users_group'][0]
			>(userGroups);

			return sortedUserGroups
				.map((userGroup) => this.adapt(userGroup))
				.map((userGroup) => {
					delete userGroup.permissions;
					return userGroup;
				});
		}
	}

	public async updateUserGroups(
		updates: UpdatePermission[]
	): Promise<{ deleted: number; inserted: number }> {
		const response = await this.dataService.execute<
			UserGroupQueryTypes['UpdateUserGroupsPermissionsMutation'],
			UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationVariables']
		>(USER_GROUP_QUERIES[getDatabaseType()].UpdateUserGroupsPermissionsDocument, {
			deletions: {
				_or: updates
					.filter((update) => !update.hasPermission)
					.map((update) => {
						if (isAvo()) {
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
					if (isAvo()) {
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
		});

		return {
			deleted:
				(response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationAvo'])
					.delete_users_group_permissions?.affected_rows ||
				(response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationHetArchief'])
					.delete_users_group_permission?.affected_rows ||
				0,
			inserted:
				(response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationAvo'])
					.insert_users_group_permissions?.affected_rows ||
				(response as UserGroupQueryTypes['UpdateUserGroupsPermissionsMutationHetArchief'])
					.insert_users_group_permission?.affected_rows ||
				0,
		};
	}
}
