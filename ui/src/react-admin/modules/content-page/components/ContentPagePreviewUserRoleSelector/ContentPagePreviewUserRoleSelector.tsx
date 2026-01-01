import { Button, Dropdown, DropdownButton, DropdownContent } from '@meemoo/react-components';
import type { RadioOption } from '@viaa/avo2-components';
import {
	Button as AvoButton,
	type DefaultProps,
	Icon,
	IconName,
	RadioButtonGroup,
} from '@viaa/avo2-components';

import { isNil, sortBy } from 'es-toolkit';
import React, { type FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import {
	GET_ALL_CONTENT,
	GET_LOGGED_OUT_USERS,
	preferredUserGroupOrder,
} from '~modules/user-group/const/user-group.const';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { isAvo } from '~shared/helpers/is-avo';
import { tText } from '~shared/helpers/translation-functions';
import { SpecialUserGroups } from '~shared/types/authentication.types';

import './ContentPagePreviewUserRoleSelector.scss';
import type { AvoUserCommonUser } from '@viaa/avo2-types';
import { ROUTE_PARTS } from '~shared/consts';
import { navigateFunc } from '~shared/helpers/navigate-fnc';

type ContentPagePreviewUserRoleSelectorProps = {
	commonUser?: AvoUserCommonUser;
	onToggleMenu?: (isOpen: boolean) => void;
};

export const ContentPagePreviewUserRoleSelector: FunctionComponent<
	ContentPagePreviewUserRoleSelectorProps & DefaultProps
> = (props) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const getUserGroupId = useCallback(
		() => new URLSearchParams(location.search).get('userGroupId'),
		[]
	);
	const setUserGroupId = useCallback(async (id: string) => {
		const url = new URL(window.location.href);
		url.searchParams.set('userGroupId', id);
		await navigateFunc(url, { replace: true });
	}, []);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Only run this once
	useEffect(() => {
		// if the queryParams are missing userGroupIds, use the userGroup of the current user
		if (isNil(getUserGroupId())) {
			if (isNil(props.commonUser?.userGroup?.id)) {
				// If user doesn't have a user group, show all content. Not sure if this can happen though.
				setUserGroupId(SpecialUserGroups.allContent);
				return;
			}
			if (location.href.includes(`/${ROUTE_PARTS.admin}/`)) {
				// If we're on the edit page of a content page, we show all content by default
				setUserGroupId(SpecialUserGroups.allContent);
				return;
			}
			// For all other cases, show the page as the user's user group
			setUserGroupId(String(props.commonUser?.userGroup?.id));
		}
	}, [props.commonUser, setUserGroupId]);

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
			...sortBy(userGroups || [], [(userGroup) => preferredUserGroupOrder[userGroup.label || '']]),
		];

		return allOptions.map(
			(opt): RadioOption => ({
				label: opt.label as string,
				value: opt.id as string,
			})
		);
	}, [userGroups, isLoading]);

	const buttonLabel = useMemo(() => {
		const selection = (userGroupOptions || []).find((item) => item.value === getUserGroupId())
			?.label as string;

		return tText(
			'modules/content-page/components/content-page-preview-user-role-selector/content-page-preview-user-role-selector___preview-als-selected-user-group',
			{ selectedUserGroup: selection }
		);
	}, [userGroupOptions, getUserGroupId]);

	const handleOpenCloseMenu = (isOpen: boolean) => {
		setIsMenuOpen(isOpen);
		props.onToggleMenu?.(isOpen);
	};

	return (
		<Dropdown
			flyoutClassName="c-menu-content"
			menuWidth="fit-content"
			placement="bottom-end"
			className={props.className}
			isOpen={isMenuOpen}
			onOpen={() => handleOpenCloseMenu(true)}
			onClose={() => handleOpenCloseMenu(false)}
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
					value={getUserGroupId() || null}
					onChange={setUserGroupId}
				/>
			</DropdownContent>
		</Dropdown>
	);
};
