import { Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import { Button, type DefaultProps, IconName } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { isNil } from 'lodash-es';
import React, { type FunctionComponent, useEffect, useMemo, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';
import { GET_SPECIAL_USER_GROUPS } from '~modules/user-group/const/user-group.const';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { UserGroupSelect } from '~shared/components/UserGroupSelect/UserGroupSelect';
import { tText } from '~shared/helpers/translation-functions';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';

type ContentPagePreviewUserRoleSelectorProps = {
	commonUser?: Avo.User.CommonUser;
};

export const ContentPagePreviewUserRoleSelector: FunctionComponent<
	ContentPagePreviewUserRoleSelectorProps & DefaultProps
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
		if (!selectedUserGroups?.length) {
			return tText('Preview voor (geen selectie)');
		}

		if (selectedUserGroups?.length > 1) {
			if (
				selectedUserGroups.includes(SpecialPermissionGroups.loggedInUsers) &&
				!selectedUserGroups.includes(SpecialPermissionGroups.loggedOutUsers)
			) {
				const selection = GET_SPECIAL_USER_GROUPS().find(
					(item) => item.id === SpecialPermissionGroups.loggedInUsers
				)?.label as string;

				return tText('Preview voor {{selectedUserGroup}}', { selectedUserGroup: selection });
			}

			return tText('Preview voor meerdere gebruikersgroepen ({{count}})', {
				count: selectedUserGroups.length.toString(),
			});
		}

		const selection = [...(allUserGroupOptions || []), ...GET_SPECIAL_USER_GROUPS()].find(
			(item) => item.id === selectedUserGroups[0]
		)?.label as string;

		return tText('Preview voor {{selectedUserGroup}}', { selectedUserGroup: selection });
	}, [allUserGroupOptions, selectedUserGroups]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run this once
	useEffect(() => {
		// if the queryParams are missing userGroupIds, use the userGroup of the current user
		if (isNil(queryParams?.userGroupIds)) {
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
	}, [props.commonUser, setQueryParams]);

	return (
		<>
			<Dropdown
				menuWidth="fit-content"
				placement="bottom-end"
				className={props.className}
				isOpen={isMenuOpen}
				onOpen={() => setIsMenuOpen(true)}
				onClose={() => setIsMenuOpen(false)}
			>
				<DropdownButton>
					<Button
						icon={IconName.eye}
						type="borderless"
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
