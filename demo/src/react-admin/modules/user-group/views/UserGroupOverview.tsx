import { keysEnter, onKey, Table, TextInput } from '@meemoo/react-components';
import React, { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { cloneDeep, remove } from 'lodash-es';
import { Column, TableOptions } from 'react-table';

import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { useGetPermissions } from '~modules/permissions/hooks/data/get-all-permissions';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { PermissionData } from '~modules/permissions/types/permissions.types';

import { AdminConfigManager } from '~core/config';
import { ToastType } from '~core/config/config.types';
import { UserGroupTableColumns } from '../const/user-group.const';
import { useGetUserGroups } from '../hooks/data/get-all-user-groups';
import { useUpdateUserGroups } from '../hooks/data/update-user-groups';
import {
	UserGroupArchief,
	UserGroupOverviewProps,
	UserGroupOverviewRef,
	UserGroupUpdate,
} from '../types/user-group.types';

const UserGroupOverview = forwardRef<UserGroupOverviewRef | undefined, UserGroupOverviewProps>(
	({ className, onChangePermissions, renderSearchButtons }, ref) => {
		/**
		 * Hooks
		 */
		const { t } = useTranslation();

		const {
			data: userGroups,
			isError: isErrorUserGroups,
			error: userGroupError,
			refetch: refetchUserGroups,
		} = useGetUserGroups();
		const {
			data: permissions,
			isError: isErrorPermissions,
			error: permissionsError,
		} = useGetPermissions();
		const { mutateAsync: updateUserGroups } = useUpdateUserGroups();

		const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

		// Use data (userGroups) as original state
		// Current state keeps track of table state
		const [currentUserGroups, setCurrentUserGroups] = useState<UserGroupArchief[] | undefined>(
			undefined
		);
		// Updated checkboxes are saved separately
		const [userGroupUpdates, setUserGroupUpdates] = useState<UserGroupUpdate[]>([]);
		const [search, setSearch] = useState<string | undefined>(undefined);
		const [searchResults, setSearchResults] = useState<PermissionData[] | undefined>(undefined);

		/**
		 * Callbacks
		 */
		const updateUserGroup = (
			userGroupId: string,
			permissionId: string,
			hasPermission: boolean
		) => {
			if (!userGroupId || !permissionId || !currentUserGroups || !permissions) {
				return;
			}

			const userGroups = cloneDeep(currentUserGroups);
			const userGroup = userGroups.find((group) => group.id === userGroupId);

			if (!userGroup) {
				return;
			}

			// Filter out permission (if present)
			const removed = remove(
				userGroup.permissions,
				(permission) => permission.id === permissionId
			);

			if (removed.length) {
				// Permission was removed
				setCurrentUserGroups(userGroups);
			} else {
				// Permission was not present
				const newPermission = permissions.find(
					(permission) => permission.id === permissionId
				);
				newPermission && userGroup.permissions.push(newPermission);
				setCurrentUserGroups(userGroups);
			}

			// Update changelog
			updateUserGroupUpdates(userGroupId, permissionId, hasPermission);
		};

		// Add updated permission to changelog
		const updateUserGroupUpdates = (
			userGroupId: string,
			permissionId: string,
			hasPermission: boolean
		) => {
			if (!userGroupId || !permissionId) {
				return;
			}

			const newUpdates = cloneDeep(userGroupUpdates);
			const currentUpdate = newUpdates?.find(
				(update) =>
					update.permissionId === permissionId && update.userGroupId === userGroupId
			);
			if (currentUpdate) {
				newUpdates.splice(newUpdates.indexOf(currentUpdate), 1);
			}
			newUpdates.push({ userGroupId, permissionId, hasPermission });
			setUserGroupUpdates(newUpdates);

			// Fire onChange for parent component
			onChangePermissions?.(!!newUpdates.length);
		};

		const onClickCancel = () => {
			setCurrentUserGroups(cloneDeep(userGroups));
			setUserGroupUpdates([]);

			// Fire onChange for parent component
			onChangePermissions?.(false);
		};

		const onClickSave = () => {
			updateUserGroups({ updates: userGroupUpdates })
				.then(() => {
					refetchUserGroups();
					setUserGroupUpdates([]);

					// Fire onChange for parent component
					onChangePermissions?.(false);
					AdminConfigManager.getConfig().services.toastService.showToast({
						title: AdminConfigManager.getConfig().services.i18n.t(
							'modules/user-group/views/user-group-overview___success'
						),
						description: AdminConfigManager.getConfig().services.i18n.t(
							'modules/user-group/views/user-group-overview___de-permissies-werden-succesvol-bewaard'
						),
						type: ToastType.ERROR,
					});
				})
				.catch((err) => {
					console.error(
						new CustomError('Failed to save permissions', err, {
							query: 'UserGroupService.updateUserGroups',
						})
					);
					AdminConfigManager.getConfig().services.toastService.showToast({
						title: AdminConfigManager.getConfig().services.i18n.t(
							'modules/user-group/views/user-group-overview___error'
						),
						description: AdminConfigManager.getConfig().services.i18n.t(
							'modules/user-group/views/user-group-overview___er-ging-iets-mis-bij-het-bewaren-van-de-permissies'
						),
						type: ToastType.ERROR,
					});
				});
		};

		const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
			setSearch(e.target.value);
		};

		const onSearchSubmit = (search: string | undefined) => {
			if (search) {
				setSearchResults(
					permissions?.filter((permission) =>
						permission.label.toLowerCase().includes(search.toLowerCase())
					)
				);
			} else {
				setSearchResults(undefined);
				setSearch(undefined);
			}
		};

		/**
		 * Ref
		 */
		// Pass functions to parent component
		useImperativeHandle(ref, () => ({
			onCancel: onClickCancel,
			onSave: onClickSave,
			onSearch: onSearchSubmit,
		}));

		/**
		 * Effects
		 */
		useEffect(() => {
			if (userGroups?.length && permissions) {
				// Initialize states
				!currentUserGroups && setCurrentUserGroups(cloneDeep(userGroups));
				setLoadingInfo({ state: 'loaded' });
			}
		}, [userGroups, permissions]);

		useEffect(() => {
			if (isErrorUserGroups) {
				console.error(
					new CustomError('Failed to get user groups', userGroupError, {
						query: 'UserGroupService.getAllUserGroups',
					})
				);
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.t(
						'modules/user-group/views/user-group-overview___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.t(
						'modules/user-group/views/user-group-overview___er-ging-iets-mis-bij-het-ophalen-van-de-gebruikersgroepen'
					),
					type: ToastType.ERROR,
				});
				setLoadingInfo({
					state: 'error',
					message: t(
						'modules/user-group/views/user-group-overview___het-ophalen-van-de-gebruikersgroepen-is-mislukt'
					),
					icon: 'alert-triangle',
				});
			}
		}, [isErrorUserGroups, t, userGroupError]);

		useEffect(() => {
			if (isErrorPermissions) {
				console.error(
					new CustomError('Failed to get permissions', permissionsError, {
						query: 'PermissionsService.getAllPermissions',
					})
				);
				AdminConfigManager.getConfig().services.toastService.showToast({
					title: AdminConfigManager.getConfig().services.i18n.t(
						'modules/user-group/views/user-group-overview___error'
					),
					description: AdminConfigManager.getConfig().services.i18n.t(
						'modules/user-group/views/user-group-overview___er-ging-iets-mis-bij-het-ophalen-van-de-permissies'
					),
					type: ToastType.ERROR,
				});
				setLoadingInfo({
					state: 'error',
					message: t(
						'modules/user-group/views/user-group-overview___het-ophalen-van-de-permissies-is-mislukt'
					),
					icon: 'alert-triangle',
				});
			}
		}, [isErrorPermissions, isErrorUserGroups, permissionsError, t, userGroupError]);

		/**
		 * Render
		 */

		const renderUserGroupOverview = () => {
			if (!currentUserGroups) {
				return null;
			}

			return (
				<div className={className}>
					<TextInput
						placeholder={t('modules/user-group/views/user-group-overview___zoek')}
						value={search}
						onChange={onSearchChange}
						onKeyDown={(e) => onKey(e, [...keysEnter], () => onSearchSubmit(search))}
						iconEnd={renderSearchButtons?.(search)}
						variants={[
							'md',
							'rounded',
							'grey-border',
							'icon--double',
							'icon-clickable',
							search ? 'black-border' : '',
						]}
					/>
					<Table
						options={
							// TODO: fix type hinting
							/* eslint-disable @typescript-eslint/ban-types */
							{
								columns: UserGroupTableColumns(
									currentUserGroups,
									updateUserGroup
								) as Column<object>[],
								data: searchResults || permissions || [],
								initialState: {
									pageSize: permissions?.length,
								},
							} as TableOptions<object>
							/* eslint-enable @typescript-eslint/ban-types */
						}
					/>
				</div>
			);
		};

		return (
			<LoadingErrorLoadedComponent
				loadingInfo={loadingInfo}
				dataObject={{ ...permissions }}
				render={renderUserGroupOverview}
			/>
		);
	}
);

export default UserGroupOverview;
