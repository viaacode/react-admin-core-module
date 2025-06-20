import { keysEnter, onKey, Table, TextInput } from '@meemoo/react-components';
import type { ChangeEvent } from 'react';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import { cloneDeep, remove, sortBy } from 'lodash-es';
import type { Column, TableOptions, UseSortByColumnOptions } from 'react-table';
import type { PermissionData } from '~modules/permissions/permissions.types';

import { CenteredSpinner } from '~shared/components/Spinner/CenteredSpinner';
import { showToast } from '~shared/helpers/show-toast';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { useGetPermissions } from '~modules/permissions/hooks/data/get-all-permissions';
import { CustomError } from '~shared/helpers/custom-error';

import { ToastType } from '~core/config/config.types';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { useUpdateUserGroups } from '~modules/user-group/hooks/update-user-groups';
import { getUserGroupTableColumns } from '../const/user-group.const';
import type {
	UserGroupOverviewProps,
	UserGroupOverviewRef,
	UserGroupUpdate,
	UserGroupWithPermissions,
} from '../types/user-group.types';

export const UserGroupOverview = forwardRef<
	UserGroupOverviewRef | undefined,
	UserGroupOverviewProps
>(({ className, onChangePermissions, renderSearchButtons }, ref) => {
	/**
	 * Hooks
	 */

	const {
		data: userGroups,
		isLoading: isLoadingUserGroups,
		isError: isErrorUserGroups,
		error: userGroupError,
		refetch: refetchUserGroups,
	} = useGetUserGroups({ withPermissions: true });
	const {
		data: permissions,
		isLoading: isLoadingPermissions,
		isError: isErrorPermissions,
		error: permissionsError,
	} = useGetPermissions();
	const { mutateAsync: updateUserGroups } = useUpdateUserGroups();

	// Use data (userGroups) as original state
	// Current state keeps track of table state
	const [currentUserGroups, setCurrentUserGroups] = useState<
		UserGroupWithPermissions[] | undefined
	>(undefined);
	// Updated checkboxes are saved separately
	const [userGroupUpdates, setUserGroupUpdates] = useState<UserGroupUpdate[]>([]);
	const [search, setSearch] = useState<string | undefined>(undefined);
	const [searchResults, setSearchResults] = useState<PermissionData[] | undefined>(undefined);

	/**
	 * Callbacks
	 */
	// Add updated permission to changelog
	const updateUserGroupUpdates = useCallback(
		(userGroupId: string, permissionId: string | number, hasPermission: boolean) => {
			if (!userGroupId || !permissionId) {
				return;
			}

			const newUpdates = cloneDeep(userGroupUpdates);
			const currentUpdate = newUpdates?.find(
				(update) => update.permissionId === permissionId && update.userGroupId === userGroupId
			);
			if (currentUpdate) {
				newUpdates.splice(newUpdates.indexOf(currentUpdate), 1);
			}
			newUpdates.push({ userGroupId, permissionId, hasPermission });
			setUserGroupUpdates(newUpdates);

			// Fire onChange for parent component
			onChangePermissions?.(!!newUpdates.length);
		},
		[onChangePermissions, userGroupUpdates]
	);

	const updateUserGroup = useCallback(
		(userGroupId: string, permissionId: string | number, hasPermission: boolean) => {
			if (!userGroupId || !permissionId || !currentUserGroups || !permissions) {
				return;
			}

			const updatedUserGroups = cloneDeep(currentUserGroups);
			const userGroup = updatedUserGroups.find((group) => String(group.id) === String(userGroupId));

			if (!userGroup) {
				return;
			}

			// Filter out permission (if present)
			const removed = remove(userGroup.permissions, (permission) => permission.id === permissionId);

			if (removed.length) {
				// Permission was removed
				setCurrentUserGroups(updatedUserGroups);
			} else {
				// Permission was not present
				const newPermission = permissions.find((permission) => permission.id === permissionId);
				if (newPermission) {
					userGroup.permissions = userGroup.permissions || [];
					userGroup.permissions.push(newPermission);
				}
				setCurrentUserGroups(updatedUserGroups);
			}

			// Update changelog
			updateUserGroupUpdates(userGroupId, permissionId, hasPermission);
		},
		[currentUserGroups, permissions, updateUserGroupUpdates]
	);

	const onClickCancel = () => {
		setCurrentUserGroups(cloneDeep(userGroups) as UserGroupWithPermissions[]);
		setUserGroupUpdates([]);

		// Fire onChange for parent component
		onChangePermissions?.(false);
	};

	const onClickSave = async () => {
		try {
			await updateUserGroups({ updates: userGroupUpdates });
			await refetchUserGroups();
			setUserGroupUpdates([]);

			// Fire onChange for parent component
			onChangePermissions?.(false);
			showToast({
				title: tText('modules/user-group/views/user-group-overview___success'),
				description: tText(
					'modules/user-group/views/user-group-overview___de-permissies-werden-succesvol-bewaard'
				),
				type: ToastType.SUCCESS,
			});
		} catch (err) {
			console.error(
				new CustomError('Failed to save permissions', err, {
					query: 'UserGroupService.updateUserGroups',
				})
			);
			showToast({
				title: tText('modules/user-group/views/user-group-overview___error'),
				description: tText(
					'modules/user-group/views/user-group-overview___er-ging-iets-mis-bij-het-bewaren-van-de-permissies'
				),
				type: ToastType.ERROR,
			});
		}
	};

	const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearch(e.target.value);
	};

	const onSearchSubmit = (search: string | undefined) => {
		if (search) {
			setSearchResults(
				sortBy(
					permissions?.filter(
						(permission) =>
							permission.label.toLowerCase().includes(search.toLowerCase()) ||
							permission.name.toLowerCase().includes(search.toLowerCase())
					),
					(permission) => permission.label
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
		setCurrentUserGroups(
			(currentUserGroups: UserGroupWithPermissions[] | undefined): UserGroupWithPermissions[] => {
				if (!currentUserGroups) {
					return cloneDeep(userGroups) as UserGroupWithPermissions[];
				} else {
					return currentUserGroups;
				}
			}
		);
	}, [userGroups]);

	useEffect(() => {
		if (isErrorUserGroups) {
			console.error(
				new CustomError('Failed to get user groups', userGroupError, {
					query: 'UserGroupService.getAllUserGroups',
				})
			);
			showToast({
				title: tText('modules/user-group/views/user-group-overview___error'),
				description: tText(
					'modules/user-group/views/user-group-overview___er-ging-iets-mis-bij-het-ophalen-van-de-gebruikersgroepen'
				),
				type: ToastType.ERROR,
			});
		}
	}, [isErrorUserGroups, userGroupError]);

	useEffect(() => {
		if (isErrorPermissions) {
			console.error(new CustomError('Failed to get permissions', permissionsError));
			showToast({
				title: tText('modules/user-group/views/user-group-overview___error'),
				description: tText(
					'modules/user-group/views/user-group-overview___er-ging-iets-mis-bij-het-ophalen-van-de-permissies'
				),
				type: ToastType.ERROR,
			});
		}
	}, [isErrorPermissions, permissionsError]);

	/**
	 * Render
	 */

	const columns = useMemo((): (Column<PermissionData> &
		UseSortByColumnOptions<PermissionData>)[] => {
		if (!currentUserGroups) {
			return [];
		}
		return getUserGroupTableColumns(currentUserGroups, updateUserGroup);
	}, [currentUserGroups, updateUserGroup]);

	const renderUserGroupOverview = () => {
		if (!currentUserGroups) {
			return null;
		}

		return (
			<div className={className}>
				<TextInput
					placeholder={tText('modules/user-group/views/user-group-overview___zoek')}
					aria-label={tText('modules/user-group/views/user-group-overview___zoekveld-aria-label')}
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
							columns,
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

	if (isLoadingUserGroups || isLoadingPermissions) {
		return <CenteredSpinner />;
	}
	if (isErrorUserGroups || isErrorPermissions) {
		return (
			<p>
				{tHtml(
					'modules/user-group/views/user-group-overview___het-ophalen-van-de-permissies-is-mislukt'
				)}
			</p>
		);
	}
	return renderUserGroupOverview();
});
