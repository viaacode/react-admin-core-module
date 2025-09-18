import React, { type FunctionComponent, useEffect, useMemo, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';

import './ContentPagePreviewUserRoleSelector.scss';
import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { Button, Container, IconName, Navbar, Toolbar, ToolbarLeft } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { isNil } from 'lodash-es';
import {
	GET_ALL_CONTENT_USER_GROUP,
	GET_SPECIAL_USER_GROUPS,
} from '~modules/user-group/const/user-group.const';
import { Icon } from '~shared/components/Icon';
import { tText } from '~shared/helpers/translation-functions';

type ContentPagePreviewUserRoleSelectorProps = {
	commonUser?: Avo.User.CommonUser;
};

export const ContentPagePreviewUserRoleSelector: FunctionComponent<
	ContentPagePreviewUserRoleSelectorProps
> = (props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const [queryParams, setQueryParams] = useQueryParams({
		// Using stringParam so we can make a difference between none selected and missing parameter
		userGroupIds: StringParam,
	});

	const { data: allUserGroupOptions } = useGetUserGroups({
		withPermissions: false,
	});

	const selectedUserGroups = useMemo(
		() => queryParams.userGroupIds?.split(',').filter((id) => !!id) || [],
		[queryParams]
	);
	const buttonLabel = useMemo(() => {
		console.log(selectedUserGroups);

		if (!selectedUserGroups?.length) {
			return tText('Preview voor niemand');
		}

		if (selectedUserGroups?.length > 1) {
			return tText('Preview voor meerdere gebruikersgroepen ({{count}})', {
				count: selectedUserGroups.length.toString(),
			});
		}

		const selection = [
			GET_ALL_CONTENT_USER_GROUP(),
			...(allUserGroupOptions || []),
			...GET_SPECIAL_USER_GROUPS(),
		].find((item) => item.id === selectedUserGroups[0])?.label as string;
		console.log(allUserGroupOptions, selection);

		return tText('Preview voor {{selectedUserGroup}}', { selectedUserGroup: selection });
	}, [allUserGroupOptions, selectedUserGroups]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run this the first time and we have no queryParams
	useEffect(() => {
		if (!isNil(queryParams?.userGroupIds)) {
			let currentUserGroupIds: string[];
			if (props.commonUser?.userGroup?.id) {
				currentUserGroupIds = [
					String(props.commonUser?.userGroup?.id),
					SpecialPermissionGroups.loggedInUsers,
				];
			} else {
				currentUserGroupIds = [SpecialPermissionGroups.loggedOutUsers];
			}

			setQueryParams({
				userGroupIds: currentUserGroupIds.join(','),
			});
		}
	}, [props.commonUser?.userGroup?.id, setQueryParams]);

	if (!allUserGroupOptions?.length) {
		return <></>;
	}

	return (
		<>
			<Dropdown
				menuWidth="fit-content"
				placement="bottom-end"
				isOpen={isMenuOpen}
				onOpen={() => setIsMenuOpen(true)}
				onClose={() => setIsMenuOpen(false)}
			>
				<DropdownButton>
					<Button
						icon={IconName.userGroup}
						type="inline-link"
						label={buttonLabel}
						ariaLabel={buttonLabel}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
				</DropdownButton>
				<DropdownContent>
					<UserGroupSelect
						label=""
						error={undefined}
						values={queryParams?.userGroupIds?.split(',') || []}
						required={false}
						enableAllContentOption={true}
						onChange={(userGroupIds: string[]) => {
							setQueryParams({
								userGroupIds: userGroupIds.join(','),
							});
						}}
					/>
					,
				</DropdownContent>
			</Dropdown>
		</>
	);
};
