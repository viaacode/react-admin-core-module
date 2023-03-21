import { Checkbox } from '@meemoo/react-components';
import React from 'react';
import { Column, UseSortByColumnOptions } from 'react-table';
import { PermissionData } from '~modules/permissions/permissions.types';
import { UserGroup, UserGroupWithPermissions } from '~modules/user-group/types/user-group.types';
import { PermissionRow } from '../types/user-group.types';
import { AdminConfigManager } from '~core/config';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';
import { sortBy } from 'lodash-es';

const preferredUserGroupOrder: Record<string, number> = {
	// Avo
	Leerling: 1,
	Lesgever: 2,
	'Student lesgever': 3,
	'Lesgever secundair': 4,
	'Student lesgever secundair': 5,
	'Educatieve auteur': 6,
	'Educatieve uitgever': 7,
	'Educatieve partner': 8,
	Contentpartner: 9,
	Redacteur: 10,
	Eindredacteur: 11,
	'Medewerker meemoo': 12,
	Beheerder: 13,

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
								onChange={() =>
									updateUserGroup(String(group?.id), row.original.id, !isChecked)
								}
							/>
						);
					},
				};
			}
		),
	];
};

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
