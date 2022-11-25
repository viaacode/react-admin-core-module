import { Avo } from '@viaa/avo2-types';
import { isNil } from 'lodash-es';

import { AdminConfigManager } from '~core/config';
import { CustomError } from '../../shared/helpers/custom-error';
import { dataService } from '../../shared/services/data-service';

import { USER_GROUP_QUERIES, UserGroupQueryTypes } from '../queries/user-group.queries';
import { ITEMS_PER_PAGE } from '../const/user-group.const';
import { UserGroup } from '../types/user-group.types';

export class UserGroupService {
	private static getQueries() {
		return USER_GROUP_QUERIES[AdminConfigManager.getConfig().database.databaseApplicationType];
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
			const response = await dataService.query<
				UserGroupQueryTypes['GetUserGroupsWithFiltersQuery'],
				UserGroupQueryTypes['GetUserGroupsWithFiltersQueryVariables']
			>({
				variables,
				query: this.getQueries().GetUserGroupsWithFiltersDocument,
			});
			const userGroups =
				(response as UserGroupQueryTypes['GetUserGroupsWithFiltersQueryAvo'])
					.users_groups ||
				(response as UserGroupQueryTypes['GetUserGroupsWithFiltersQueryHetArchief'])
					.users_group;
			const userGroupCount =
				(response as UserGroupQueryTypes['GetUserGroupsWithFiltersQueryAvo'])
					.users_groups_aggregate?.aggregate?.count ||
				(response as UserGroupQueryTypes['GetUserGroupsWithFiltersQueryHetArchief'])
					.users_group_aggregate?.aggregate?.count;

			if (!userGroups) {
				throw new CustomError(
					'Response from database does not contain any user groups',
					null,
					{ response }
				);
			}

			return [userGroups, userGroupCount] as [UserGroup[], number];
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

	public static async insertUserGroup(userGroup: UserGroup): Promise<number> {
		try {
			const response = await dataService.query<
				UserGroupQueryTypes['InsertUserGroupMutation'],
				UserGroupQueryTypes['InsertUserGroupMutationVariables']
			>({
				query: this.getQueries().InsertUserGroupDocument,
				variables: {
					userGroup: {
						label: userGroup.label,
						description: userGroup.description,
					} as UserGroupQueryTypes['InsertUserGroupMutationVariables']['userGroup'],
				},
			});

			const userGroupId = (
				(response as UserGroupQueryTypes['InsertUserGroupMutationAvo'])
					.insert_users_groups ||
				(response as UserGroupQueryTypes['InsertUserGroupMutationHetArchief'])
					.insert_users_group
			)?.returning?.[0]?.id;

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
			await dataService.query<
				UserGroupQueryTypes['UpdateUserGroupMutation'],
				UserGroupQueryTypes['UpdateUserGroupMutationVariables']
			>({
				query: this.getQueries().UpdateUserGroupDocument,
				variables: {
					userGroup: {
						label: userGroup.label,
						description: userGroup.description,
					},
					userGroupId: userGroup.id,
				},
			});
		} catch (err) {
			throw new CustomError('Failed to update user group in the database', err, {
				userGroup,
				query: 'UPDATE_USER_GROUP',
			});
		}
	}

	public static async deleteUserGroup(userGroupId: number): Promise<void> {
		try {
			await dataService.query<
				UserGroupQueryTypes['DeleteUserGroupMutation'],
				UserGroupQueryTypes['DeleteUserGroupMutationVariables']
			>({
				query: this.getQueries().DeleteUserGroupDocument,
				variables: {
					userGroupId,
				},
			});
		} catch (err) {
			throw new CustomError('Failed to delete user group from the database', err, {
				userGroupId,
				query: 'DELETE_USER_GROUP',
			});
		}
	}
}
