import { Checkbox } from '@meemoo/react-components';
import type { TagInfo } from '@viaa/avo2-components';
import { compact, sortBy } from 'lodash-es';
import React from 'react';
import type { Column, UseSortByColumnOptions } from 'react-table';
import type { PermissionData } from '~modules/permissions/permissions.types';
import type {
	UserGroup,
	UserGroupWithPermissions,
} from '~modules/user-group/types/user-group.types';
import { tText } from '~shared/helpers/translation-functions';
import { SpecialUserGroups } from '~shared/types/authentication.types';
import type { PermissionRow } from '../types/user-group.types';

export const preferredUserGroupOrder: Record<string, number> = {
	// Avo
	'Leerling lager': 1,
	'Leerling secundair': 2,
	'Student lesgever': 3,
	Lesgever: 4,
	'Student lesgever lager': 5,
	'Lesgever lager': 6,
	'Student lesgever secundair': 7,
	'Lesgever secundair': 8,
	'Educatieve auteur': 9,
	'Educatieve uitgever': 10,
	'Educatieve partner': 11,
	Contentpartner: 12,
	'Medewerker meemoo': 13,
	Redacteur: 14,
	Eindredacteur: 15,
	Beheerder: 16,

	// Hetarchief
	Kioskgebruiker: 1,
	Bezoeker: 2,
	'CP beheerder': 3,
	'Meemoo beheerder': 4,
};

export const getUserGroupTableColumns = (
	userGroups: UserGroupWithPermissions[],
	updateUserGroup: (groupId: string, permissionId: string | number, value: boolean) => void
): (Column<PermissionData> & UseSortByColumnOptions<PermissionData>)[] => {
	return [
		{
			Header: '',
			accessor: 'label',
			disableSortBy: true,
			Cell: ({ row }: PermissionRow) => {
				return <span title={row.original.description}>{row.original.label}</span>;
			},
		},
		...sortBy(userGroups, (userGroup) => preferredUserGroupOrder[userGroup.label] || 0).map(
			(group) => {
				return {
					Header: () => <span>{group?.label || ''}</span>,
					id: `${group?.name}-${group?.id}`,
					accessor: (row: PermissionData) => row.name,
					disableSortBy: true,
					Cell: ({ row }: PermissionRow) => {
						const isChecked = !!group?.permissions?.find(
							(permission: PermissionData) => permission.id === row.original.id
						);

						return (
							<Checkbox
								checked={isChecked}
								value={`${group?.name}-${row.original.name}`}
								onChange={() => updateUserGroup(String(group?.id), row.original.id, !isChecked)}
							/>
						);
					},
				};
			}
		),
	];
};

export const isSubUserGroup = (userGroupOptionValue: string | number) =>
	!GET_SPECIAL_USER_GROUPS_IDS().includes(String(userGroupOptionValue));

export const getAllSubgroupIds = (userGroupOptions: (Partial<UserGroup> | TagInfo)[]) => {
	return compact(
		userGroupOptions.map((item) => {
			return (item as UserGroup).id || (item as TagInfo).value?.toString();
		})
	).filter((item) => isSubUserGroup(item));
};

export const GET_ALL_CONTENT: () => Partial<UserGroup> = () => ({
	label: tText('modules/user-group/const/user-group___alle-content'),
	id: SpecialUserGroups.allContent,
});

export const GET_LOGGED_OUT_USERS: () => Partial<UserGroup> = () => ({
	label: tText('admin/menu/components/menu-edit-form/menu-edit-form___niet-ingelogde-gebruikers'),
	id: SpecialUserGroups.loggedOutUsers,
});

export const GET_LOGGED_IN_USERS: () => Partial<UserGroup> = () => ({
	label: tText('admin/menu/components/menu-edit-form/menu-edit-form___ingelogde-gebruikers'),
	id: SpecialUserGroups.loggedInUsers,
});

export const GET_SPECIAL_USER_GROUPS: () => Partial<UserGroup>[] = () => [
	GET_LOGGED_OUT_USERS(),
	GET_LOGGED_IN_USERS(),
];

export const GET_SPECIAL_USER_GROUPS_IDS: () => string[] = () =>
	compact(GET_SPECIAL_USER_GROUPS().map((item) => item?.id));
