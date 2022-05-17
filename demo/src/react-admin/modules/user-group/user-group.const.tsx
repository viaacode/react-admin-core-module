import React from 'react';
import { Checkbox } from '@meemoo/react-components';
import { Column } from 'react-table';
import { UserGroup } from '~modules/user-group/user-group.types';
import { ROUTE_PARTS } from '../shared/consts/routes';
import { PermissionData, PermissionRow } from './user-group.types';
import { Config } from '~core/config';
import { SpecialPermissionGroups } from '~modules/shared/types/authentication.types';
import { FilterableColumn } from '~modules/shared/components/FilterTable/FilterTable';
import { Permission } from '~modules/user/user.types';

export const USER_GROUP_PATH = {
	USER_GROUP_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}`,
	USER_GROUP_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id`,
	USER_GROUP_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/${ROUTE_PARTS.create}`,
	USER_GROUP_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.userGroup}/:id/${ROUTE_PARTS.edit}`,
};

export const ITEMS_PER_PAGE = 20;

export const UserGroupTableColumns = (
	userGroups: UserGroup[],
	updateUserGroup: (groupId: string, permissionId: string, value: boolean) => void,
): Column<PermissionData>[] => [
	{
		Header: '',
		accessor: 'label',
	},
	...userGroups.map((group) => {
		return {
			Header: group.label,
			id: `${group.label}-${group.id}`,
			accessor: (row: PermissionData) => row.label ,
			Cell: ({row}: PermissionRow) => {
				const isChecked = group.permissions
					? !!group.permissions.filter((permission: Permission) => permission === row.original.name).length
					: false;

				return <Checkbox
					checked={isChecked}
					value={`${group.label}-${row.original.label}`}
					onChange={() => updateUserGroup(String(group.id), row.original.id, !isChecked)}
				/>
			},
		}
	}),
]


export const GET_SPECIAL_USER_GROUPS: () => Partial<UserGroup>[] = () => [
	{
		label: Config.getConfig().services.i18n.t(
			'admin/menu/components/menu-edit-form/menu-edit-form___niet-ingelogde-gebruikers'
		),
		id: SpecialPermissionGroups.loggedOutUsers,
	},
	{
		label: Config.getConfig().services.i18n.t(
			'admin/menu/components/menu-edit-form/menu-edit-form___ingelogde-gebruikers'
		),
		id: SpecialPermissionGroups.loggedInUsers,
	},
];

export const GET_USER_GROUP_OVERVIEW_TABLE_COLS: () => FilterableColumn[] = () => [
	{
		id: 'label',
		label: Config.getConfig().services.i18n.t('admin/user-groups/user-group___label'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'description',
		label: Config.getConfig().services.i18n.t('admin/user-groups/user-group___beschrijving'),
		sortable: true,
		visibleByDefault: true,
		dataType: 'string',
	},
	{
		id: 'created_at',
		label: Config.getConfig().services.i18n.t('admin/user-groups/user-group___aangemaakt-op'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'updated_at',
		label: Config.getConfig().services.i18n.t('admin/user-groups/user-group___aangepast-op'),
		sortable: true,
		visibleByDefault: true,
		filterType: 'DateRangeDropdown',
		dataType: 'dateTime',
	},
	{
		id: 'actions',
		tooltip: Config.getConfig().services.i18n.t('admin/user-groups/user-group___acties'),
		visibleByDefault: true,
	},
];

export enum SpecialUserGroup {
	Admin = 1,
	Teacher = 2,
	TeacherSecondary = 3,
	Pupil = 4,
	Editor = 7,
	EditorInChief = 8,
	ContentPartner = 9,
	EducativeAuthor = 10,
	EducativePublisher = 11,
	EducativePartner = 12,
}
