import React, {
	ChangeEvent,
	FC,
	useEffect,
	useState,
} from 'react';

import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { AdminLayout } from '~modules/shared/layouts';
import { useTranslation } from '~modules/shared/hooks/useTranslation';

import { Column, TableOptions } from 'react-table';
import { Button, keysEnter, onKey, Table, TextInput } from '@meemoo/react-components';
import { UserGroupTableColumns } from '../const/user-group.const';
import { useGetUserGroups } from '../hooks/data/get-all-user-groups';
import { useGetPermissions } from '~modules/permissions/hooks/data/get-all-permissions';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { useUpdateUserGroups } from '../hooks/data/update-user-groups';
import { UserGroupArchief, UserGroupUpdate } from '../types/user-group.types';
import { cloneDeep, remove } from 'lodash-es';
import { PermissionData } from '~modules/permissions/types/permissions.types';

const UserGroupOverview: FC = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	const { data: userGroups, isError: isErrorUserGroups, error: userGroupError, refetch: refetchUserGroups } = useGetUserGroups();
	const { data: permissions, isError: isErrorPermissions, error: permissionsError } = useGetPermissions();
	const { mutateAsync: updateUserGroups } = useUpdateUserGroups();

	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

	// Use data (userGroups) as original state
	// Current state keeps track of table state
	const [currentState, setCurrentState] = useState<UserGroupArchief[] | undefined>(undefined);
	// Updated checkboxes are saved separately
	const [userGroupUpdates, setUserGroupUpdates] = useState<UserGroupUpdate[]>([]);
	const [search, setSearch] = useState<string | undefined>(undefined);
	const [searchResults, setSearchResults] = useState<PermissionData[] | undefined>(undefined);

	/**
	 * Callbacks
	 */
	const updateUserGroup = (userGroupId: string, permissionId: string, hasPermission: boolean) => {
		if (!userGroupId || !permissionId || !currentState || !permissions) {
			return;
		}

		const newState = cloneDeep(currentState);
		const userGroup = newState.find((group) => group.id === userGroupId);

		if (!userGroup) {
			return;
		}

		// Filter out permission (if present)
		const removed = remove(userGroup.permissions, (permission) => permission.id === permissionId);

		if (removed.length) {
			// Permission was removed
			setCurrentState(newState);
		} else {

			// Permission was not present
			const newPermission = permissions.find((permission) => permission.id === permissionId);
			newPermission && userGroup.permissions.push(newPermission);
			setCurrentState(newState);
		}

		// Update changelog
		updateUserGroupUpdates(userGroupId, permissionId, hasPermission);
	}

	// Add updated permission to changelog
	const updateUserGroupUpdates = (userGroupId: string, permissionId: string, hasPermission: boolean) => {
		if (!userGroupId || !permissionId) {
			return;
		}

		const newUpdates = cloneDeep(userGroupUpdates);
		const currentUpdate = newUpdates?.find((update) => update.permissionId === permissionId && update.userGroupId === userGroupId);
		if (currentUpdate) {
			newUpdates.splice(newUpdates.indexOf(currentUpdate), 1);
		}
		newUpdates.push({userGroupId, permissionId, hasPermission});
		setUserGroupUpdates(newUpdates);
	}

	const onClickCancel = () => {
		setCurrentState(cloneDeep(userGroups));
		setUserGroupUpdates([]);
	}

	const onClickSave = () => {
		updateUserGroups({updates: userGroupUpdates})
		.then(() => {
			refetchUserGroups()
			setUserGroupUpdates([]);
		})
		.catch((err) => {
			console.error(
				new CustomError('Failed to save permissions', err, {
					query: 'UserGroupService.updateUserGroups',
				})
			);
		});
	}

	const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	}

	const onSearchSubmit = (search: string | undefined) => {
		if (search) {
			setSearchResults(permissions?.filter((permission) => permission.label.toLowerCase().indexOf(search.toLowerCase()) != -1))
		} else {
			setSearchResults(undefined);
		}
	}

	/**
	 * Effects
	 */
	useEffect(() => {
		if (userGroups && permissions) {
			// Initialize states
			!currentState && setCurrentState(cloneDeep(userGroups));
			setLoadingInfo({ state: 'loaded' });
		}
	}, [userGroups, permissions]);

	useEffect(() => {
		if ( isErrorUserGroups ) {
			console.error(
				new CustomError('Failed to get user groups', userGroupError, {
					query: 'UserGroupService.getAllUserGroups',
				})
			);
			setLoadingInfo({
				state: 'error',
				message: t(
					'admin/content/views/content-overview___het-ophalen-van-de-content-paginas-is-mislukt'
				),
				icon: 'alert-triangle',
			});
		}
	}, [isErrorUserGroups, t, userGroupError])

	useEffect(() => {
		if (isErrorPermissions) {
			console.error(
				new CustomError('Failed to get permissions', permissionsError, {
					query: 'PermissionsService.getAllPermissions',
				})
			);
			setLoadingInfo({
				state: 'error',
				message: t(
					'admin/content/views/content-overview___het-ophalen-van-de-content-paginas-is-mislukt'
				),
				icon: 'alert-triangle',
			});
		}
	}, [isErrorPermissions, isErrorUserGroups, permissionsError, t, userGroupError])

	/**
	 * Render
	 */

	const renderUserGroupOverview = () => {
		if (!currentState) {
			return null;
		}

		return (
			<>
				<TextInput
					value={search}
					onChange={onSearchChange}
					onKeyDown={(e) => onKey(e, [...keysEnter], () => onSearchSubmit(search))}
					iconEnd={
						<>
							{search && (
								<Button
									label={t('Reset')}
									onClick={() => {
										setSearch(undefined);
										onSearchSubmit(undefined);
									}}
								/>
							)}
							<Button
								label={t('Zoek')}
								onClick={() => onSearchSubmit(search)}
							/>
						</>
					}
				/>
				<Table
					options={
						// TODO: fix type hinting
						/* eslint-disable @typescript-eslint/ban-types */
						{
							columns: UserGroupTableColumns(currentState, updateUserGroup) as Column<object>[],
							data: searchResults || permissions || [],
							initialState: {
								pageSize: permissions?.length,
							},
						} as TableOptions<object>
						/* eslint-enable @typescript-eslint/ban-types */
					}
				/>
				{!!userGroupUpdates.length &&
					<>
						<Button onClick={onClickCancel} label={t('Annuleren')}/>
						<Button onClick={onClickSave} label={t('Wijzigingen opslaan')}/>
					</>
				}
			</>
		);
	};

	return (
		<AdminLayout pageTitle={t('User groups')}>
			<AdminLayout.Actions></AdminLayout.Actions>
			<AdminLayout.Content>
				<LoadingErrorLoadedComponent
					loadingInfo={loadingInfo}
					dataObject={{ ...permissions }}
					render={renderUserGroupOverview}
				/>
			</AdminLayout.Content>
		</AdminLayout>
	);
};

export default UserGroupOverview;
