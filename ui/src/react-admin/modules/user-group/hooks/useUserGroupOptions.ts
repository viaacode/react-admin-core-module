import type { MultiSelectOption } from '@meemoo/react-components';
import type { TagInfo } from '@viaa/avo2-components';
import { sortBy } from 'es-toolkit';
import { useMemo } from 'react';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import type {
	UserGroup,
	UserGroupWithPermissions,
} from '~modules/user-group/types/user-group.types';
import type { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { GET_SPECIAL_USER_GROUPS, preferredUserGroupOrder } from '../const/user-group.const';

type UseUserGroupsTriple = [
	TagInfo[] | CheckboxOption[] | MultiSelectOption[],
	UserGroup[] | UserGroupWithPermissions[],
	boolean,
];

export const useUserGroupOptions = (
	type: 'CheckboxOption' | 'MultiSelectOption' | 'TagInfo',
	/**
	 * Whether to include special user groups:
	 * - All logged in users
	 * - All logged out users
	 */
	includeSpecialGroups: boolean,
	/**
	 * Also fetch the permissions of every user group
	 * Omitting this info when you don't need it makes the query faster
	 */
	includePermissions: boolean
): UseUserGroupsTriple => {
	const { data: userGroups, isLoading } = useGetUserGroups({
		withPermissions: includePermissions,
	});

	const userGroupOptions = useMemo(() => {
		if (isLoading) {
			return [];
		}
		const allOptions = [
			...(includeSpecialGroups ? GET_SPECIAL_USER_GROUPS() : []),
			...sortBy(userGroups || [], [(userGroup) => preferredUserGroupOrder[userGroup.label || '']]),
		];

		if (type === 'TagInfo') {
			return allOptions.map(
				(opt): TagInfo => ({
					label: opt.label as string,
					value: opt.id as string,
				})
			);
		} else {
			return allOptions.map(
				(opt): CheckboxOption => ({
					label: opt.label as string,
					id: String(opt.id),
					checked: false,
				})
			);
		}
	}, [userGroups, includeSpecialGroups, type, isLoading]);

	return [userGroupOptions, userGroups || [], isLoading];
};
