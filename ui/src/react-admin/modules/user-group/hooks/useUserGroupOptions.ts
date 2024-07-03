import type { MultiSelectOption } from '@meemoo/react-components';
import { useMemo } from 'react';

import { TagInfo } from '@viaa/avo2-components';

import { CheckboxOption } from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { UserGroup, UserGroupWithPermissions } from '~modules/user-group/types/user-group.types';
import { GET_SPECIAL_USER_GROUPS, preferredUserGroupOrder } from '../const/user-group.const';
import { sortBy } from 'lodash';

type UseUserGroupsTriple = [
	TagInfo[] | CheckboxOption[] | MultiSelectOption[],
	UserGroup[] | UserGroupWithPermissions[],
	boolean,
];

export const useUserGroupOptions = (
	type: 'CheckboxOption' | 'MultiSelectOption' | 'TagInfo',
	includeSpecialGroups: boolean,
	includePermissions: boolean
): UseUserGroupsTriple => {
	const { data: userGroups, isLoading } = useGetUserGroups({
		withPermissions: includePermissions,
	});

	const userGroupOptions = useMemo(() => {
		const allOptions = sortBy([
			...(includeSpecialGroups ? GET_SPECIAL_USER_GROUPS() : []),
			...(userGroups || []),
		], (userGroup) => preferredUserGroupOrder[userGroup.label || '']);

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
	}, [userGroups, includeSpecialGroups, type]);

	return [userGroupOptions, userGroups || [], isLoading];
};
