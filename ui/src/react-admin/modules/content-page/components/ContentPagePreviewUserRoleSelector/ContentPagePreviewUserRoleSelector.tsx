import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import type { RadioOption } from '@viaa/avo2-components';
import {
	Button as AvoButton,
	type DefaultProps,
	Icon,
	IconName,
	RadioButtonGroup,
} from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';
import { isNil, sortBy } from 'lodash-es';
import React, { type FunctionComponent, useEffect, useMemo, useState } from 'react';
import { StringParam, useQueryParams } from 'use-query-params';
import {
	GET_ALL_CONTENT,
	GET_LOGGED_OUT_USERS,
	preferredUserGroupOrder,
} from '~modules/user-group/const/user-group.const';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { isAvo } from '~shared/helpers/is-avo';
import { tText } from '~shared/helpers/translation-functions';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';

import './ContentPagePreviewUserRoleSelector.scss';

type ContentPagePreviewUserRoleSelectorProps = {
	commonUser?: Avo.User.CommonUser;
};

export const ContentPagePreviewUserRoleSelector: FunctionComponent<
	ContentPagePreviewUserRoleSelectorProps & DefaultProps
> = (props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [queryParams, setQueryParams] = useQueryParams({
		// Using stringParam so we can make a difference between none selected and missing parameter
		userGroupId: StringParam,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run this once
	useEffect(() => {
		// if the queryParams are missing userGroupIds, use the userGroup of the current user
		if (isNil(queryParams?.userGroupId)) {
			setQueryParams({
				userGroupId: String(
					props.commonUser?.userGroup?.id
						? props.commonUser?.userGroup?.id
						: SpecialPermissionGroups.allContent
				),
			});
		}
	}, [props.commonUser, setQueryParams]);

	const { data: userGroups, isLoading } = useGetUserGroups({
		withPermissions: false,
	});

	const userGroupOptions = useMemo(() => {
		if (isLoading) {
			return [];
		}
		const allOptions = [
			GET_ALL_CONTENT(),
			GET_LOGGED_OUT_USERS(),
			...sortBy(userGroups || [], (userGroup) => preferredUserGroupOrder[userGroup.label || '']),
		];

		return allOptions.map(
			(opt): RadioOption => ({
				label: opt.label as string,
				value: opt.id as string,
			})
		);
	}, [userGroups, isLoading]);

	const buttonLabel = useMemo(() => {
		const selection = (userGroupOptions || []).find(
			(item) => item.value === queryParams.userGroupId
		)?.label as string;

		return tText('Preview als {{selectedUserGroup}}', { selectedUserGroup: selection });
	}, [userGroupOptions, queryParams.userGroupId]);

	return (
		<Dropdown
			flyoutClassName="c-menu-content"
			menuWidth="fit-content"
			placement="bottom-end"
			className={props.className}
			isOpen={isMenuOpen}
			onOpen={() => setIsMenuOpen(true)}
			onClose={() => setIsMenuOpen(false)}
		>
			<DropdownButton>
				{isAvo() ? (
					<AvoButton
						icon={IconName.eye}
						type="borderless"
						label={buttonLabel}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
				) : (
					<Button
						iconStart={<Icon name={IconName.eye} />}
						label={buttonLabel}
						variants="text"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
					/>
				)}
			</DropdownButton>
			<DropdownContent>
				<RadioButtonGroup
					options={userGroupOptions}
					value={queryParams?.userGroupId || null}
					onChange={(userGroupId: string) => {
						setQueryParams({ userGroupId });
					}}
				/>
			</DropdownContent>
		</Dropdown>
	);
};
