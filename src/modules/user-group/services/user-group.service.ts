import { Avo } from '@viaa/avo2-types';
import { get, isNil } from 'lodash-es';

import { Config } from '~core/config';
import { CustomError } from '../../shared/helpers/custom-error';
import { dataService } from '../../shared/services/data-service';

import { USER_GROUP_QUERIES } from '../queries/user-group.queries';
import { ITEMS_PER_PAGE } from '../const/user-group.const';
import { UserGroup } from '../types/user-group.types';

export class UserGroupService {
	private static getQueries() {
		return USER_GROUP_QUERIES[Config.getConfig().database.databaseApplicationType];
	}

	public static async fetchUserGroups(
		page: number,
		sortColumn: string,
		sortOrder: Avo.Search.OrderDirection,
		where: any
	): Promise<[UserGroup[], number]> {
		let variables: any;
		try {
			variables = {
				where,
				offset: ITEMS_PER_PAGE * page,
				limit: ITEMS_PER_PAGE,
				orderBy: [{ [sortColumn]: sortOrder }],
			};
			const response = await dataService.query({
				variables,
				query: this.getQueries().GetUserGroupsWithFiltersDocument,
			});
			const userGroups =
				get(response, 'data.users_groups') || get(response, 'data.users_group');
			const userGroupCount =
				get(response, 'data.users_groups_aggregate.aggregate.count') ||
				get(response, 'data.users_group_aggregate.aggregate.count');

			if (!userGroups) {
				throw new CustomError(
					'Response from database does not contain any user groups',
					null,
					{ response }
				);
			}

			return [userGroups, userGroupCount];
		} catch (err) {
			throw new CustomError('Failed to fetch user groups from graphql', err, {
				variables,
				query: 'GET_USER_GROUPS_WITH_FILTERS',
			});
		}
	}

	public static async fetchAllUserGroups(): Promise<UserGroup[]> {
		const response = await UserGroupService.fetchUserGroups(0, 'label', 'asc', {});
		return response[0];
	}

	public static async fetchUserGroupById(id: string): Promise<UserGroup | undefined> {
		let variables: any;
		try {
			variables = {
				id,
			};
			const response = await dataService.query({
				variables,
				query: this.getQueries().GetUserGroupByIdDocument,
			});

			if (response.errors) {
				throw new CustomError('response contains errors', null, { response });
			}

			return get(response, 'data.users_groups[0]') || get(response, 'data.users_group[0]');
		} catch (err) {
			throw new CustomError('Failed to fetch user group by id from graphql', err, {
				variables,
				query: 'GET_USER_GROUP_BY_ID',
			});
		}
	}

	// TODO convert to addPermissionToUserGroup
	// public static async addPermissionGroupsToUserGroup(
	// 	permissionGroupIds: number[],
	// 	userGroupId: number | string
	// ): Promise<void> {
	// 	try {
	// 		const response = await dataService.mutate({
	// 			mutation: ADD_PERMISSION_GROUPS_TO_USER_GROUP,
	// 			variables: {
	// 				objs: permissionGroupIds.map((permissionGroupId) => ({
	// 					user_permission_group_id: permissionGroupId,
	// 					user_group_id: userGroupId,
	// 				})),
	// 			},
	// 			update: ApolloCacheManager.clearUserGroupCache,
	// 		});
	// 		if (response.errors) {
	// 			throw new CustomError('Failed to add permission groups to user group', null, {
	// 				errors: response.errors,
	// 			});
	// 		}
	// 	} catch (err) {
	// 		throw new CustomError('Failed to add permission groups to user group', err, {
	// 			query: 'ADD_PERMISSION_GROUPS_TO_USER_GROUP',
	// 			variables: {
	// 				permissionGroupIds,
	// 				userGroupId,
	// 			},
	// 		});
	// 	}
	// }

	// TODO convert to removePermissionsFromUserGroup
	// public static async removePermissionGroupsFromUserGroup(
	// 	permissionGroupIds: number[],
	// 	userGroupId: number | string
	// ): Promise<void> {
	// 	try {
	// 		const response = await dataService.mutate({
	// 			mutation: REMOVE_PERMISSION_GROUPS_FROM_USER_GROUP,
	// 			variables: {
	// 				permissionGroupIds,
	// 				userGroupId,
	// 			},
	// 			update: ApolloCacheManager.clearUserGroupCache,
	// 		});
	// 		if (response.errors) {
	// 			throw new CustomError('Failed to remove permission groups from user group', null, {
	// 				errors: response.errors,
	// 			});
	// 		}
	// 	} catch (err) {
	// 		throw new CustomError('Failed to remove permission groups from user group', err, {
	// 			query: 'REMOVE_PERMISSION_GROUPS_FROM_USER_GROUP',
	// 			variables: {
	// 				permissionGroupIds,
	// 				userGroupId,
	// 			},
	// 		});
	// 	}
	// }

	public static async insertUserGroup(userGroup: UserGroup): Promise<number> {
		try {
			const response = await dataService.query({
				query: this.getQueries().InsertUserGroupDocument,
				variables: {
					userGroup: {
						label: userGroup.label,
						description: userGroup.description,
					} as Partial<UserGroup>,
				},
			});
			if (response.errors) {
				throw new CustomError('Failed to insert user group in the database', null, {
					response,
					errors: response.errors,
				});
			}
			const userGroupId = get(response, 'data.insert_users_groups.returning[0].id');
			if (isNil(userGroupId)) {
				throw new CustomError(
					'Response from database does not contain the id of the inserted user group',
					null,
					{ response }
				);
			}
			return userGroupId;
		} catch (err) {
			throw new CustomError('Failed to insert user group in the database', err, {
				userGroup,
				query: 'INSERT_USER_GROUP',
			});
		}
	}

	static async updateUserGroup(userGroup: UserGroup): Promise<void> {
		try {
			const response = await dataService.query({
				query: this.getQueries().UpdateUserGroupDocument,
				variables: {
					userGroup: {
						label: userGroup.label,
						description: userGroup.description,
					} as Partial<UserGroup>,
					userGroupId: userGroup.id,
				},
			});
			if (response.errors) {
				throw new CustomError('Failed to update user group in the database', null, {
					response,
					errors: response.errors,
				});
			}
		} catch (err) {
			throw new CustomError('Failed to update user group in the database', err, {
				userGroup,
				query: 'UPDATE_USER_GROUP',
			});
		}
	}

	public static async deleteUserGroup(userGroupId: number): Promise<void> {
		try {
			const response = await dataService.query({
				query: this.getQueries().DeleteUserGroupDocument,
				variables: {
					userGroupId,
				},
			});
			if (response.errors) {
				throw new CustomError('Failed to delete user group from the database', null, {
					response,
					errors: response.errors,
				});
			}
		} catch (err) {
			throw new CustomError('Failed to delete user group from the database', err, {
				userGroupId,
				query: 'DELETE_USER_GROUP',
			});
		}
	}
}
