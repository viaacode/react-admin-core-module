import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

import {
	LoadingErrorLoadedComponent,
	LoadingInfo,
} from '~modules/shared/components/LoadingErrorLoadedComponent/LoadingErrorLoadedComponent';
import { AdminLayout } from '~modules/shared/layouts';
import { UserProps } from '~modules/shared/types';
import { useTranslation } from '~modules/shared/hooks/useTranslation';
import { CustomError } from '~modules/shared/helpers/custom-error';
import { UserGroupService } from '~modules/user-group/user-group.service';
import { UserGroup } from '~modules/user-group/user-group.types';

import { permissionDataMock } from '../mocks';
import { PermissionData } from '../user-group.types';
import { Column, TableOptions } from 'react-table';
import { Table } from '@meemoo/react-components';
import { UserGroupTableColumns } from '../user-group.const';

const ContentPageOverview: FunctionComponent<UserProps> = () => {
	/**
	 * Hooks
	 */
	const { t } = useTranslation();

	const [userGroups, setUserGroups] = useState<UserGroup[] | null>(null);
	const [permissions, setPermissions] = useState<PermissionData[] | null>(null);
	const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({ state: 'loading' });

	/**
	 * Callbacks
	 */

	const updateUserGroup = (groupId: string, permissionId: string, value: boolean) => {
		console.log(groupId, permissionId, value);

		// Refetch permissions
	};

	const fetchUserGroups = useCallback(async () => {
		try {
			// setIsLoading(true);
			const [userGroupArray] = await UserGroupService.fetchUserGroups(0, 'label', 'asc', {});

			setUserGroups(userGroupArray);
		} catch (err) {
			console.error(
				new CustomError('Failed to get content pages from graphql', err, {
					query: 'GET_USER_GROUPS_WITH_FILTERS',
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
		// setIsLoading(false);
	}, [t]);

	/**
	 * Effects
	 */
	useEffect(() => {
		setPermissions(permissionDataMock.data.users_permission);
	}, []);

	useEffect(() => {
		if (userGroups && permissions) {
			setLoadingInfo({ state: 'loaded' });
		}
	}, [userGroups, permissions]);

	useEffect(() => {
		fetchUserGroups();
	}, [fetchUserGroups]);

	/**
	 * Render
	 */

	const renderUserGroupOverview = () => {
		if (!userGroups) {
			return null;
		}

		return (
			<Table
				options={
					// TODO: fix type hinting
					/* eslint-disable @typescript-eslint/ban-types */
					{
						columns: UserGroupTableColumns(
							userGroups,
							updateUserGroup
						) as Column<object>[],
						data: permissionDataMock.data.users_permission || [],
					} as TableOptions<object>
					/* eslint-enable @typescript-eslint/ban-types */
				}
			/>
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

export default ContentPageOverview;
