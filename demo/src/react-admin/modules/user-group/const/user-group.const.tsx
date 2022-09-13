import React from 'react';
import { Checkbox } from '@meemoo/react-components';
import { Column, UseSortByColumnOptions } from 'react-table';
import { UserGroup, UserGroupArchief } from '~modules/user-group/types/user-group.types';
import { ROUTE_PARTS } from '../../shared/consts/routes';
import { PermissionRow } from '../types/user-group.types';
import { AdminConfigManager } from '~core/config';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { PermissionData } from '~modules/permissions/types/permissions.types';
import { sortBy } from 'lodash-es';

export const USER_GROUP_QUERY_KEYS = {
	all: ['user-group'] as const,
};

export const USER_GROUP_PATH = {
	USER_GROUP_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}`,
	USER_GROUP_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id`,
	USER_GROUP_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/${ROUTE_PARTS.create}`,
	USER_GROUP_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id/${ROUTE_PARTS.edit}`,
};

export const ITEMS_PER_PAGE = 20;

export const UserGroupTableColumns = (
	userGroups: UserGroupArchief[],
	updateUserGroup: (groupId: string, permissionId: string, value: boolean) => void
): (Column<PermissionData> & UseSortByColumnOptions<PermissionData>)[] => [
	{
		Header: '',
		accessor: 'label',
		disableSortBy: true,
	},
	...sortBy(userGroups, (userGroup) => userGroup.permissions.length).map((group) => {
		return {
			Header: group?.label || '',
			id: `${group?.name}-${group?.id}`,
			accessor: (row: PermissionData) => row.name,
			disableSortBy: true,
			Cell: ({ row }: PermissionRow) => {
				const isChecked = group?.permissions
					? !!group?.permissions.find(
							(permission: PermissionData) => permission.id === row.original.id
					  )
					: false;

				return (
					<Checkbox
						checked={isChecked}
						value={`${group?.name}-${row.original.name}`}
						onChange={() =>
							updateUserGroup(String(group?.id), row.original.id, !isChecked)
						}
					/>
				);
			},
		};
	}),
];

export const GET_SPECIAL_USER_GROUPS: () => Partial<UserGroup>[] = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/menu/components/menu-edit-form/menu-edit-form___niet-ingelogde-gebruikers'
		),
		id: SpecialPermissionGroups.loggedOutUsers,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/menu/components/menu-edit-form/menu-edit-form___ingelogde-gebruikers'
		),
		id: SpecialPermissionGroups.loggedInUsers,
	},
];
