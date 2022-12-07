import { useMemo } from 'react';

import { TagInfo } from '@viaa/avo2-components';

import { CheckboxOption } from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { useGetUserGroups } from '~modules/user-group/hooks/get-user-groups';
import { GET_SPECIAL_USER_GROUPS } from '../const/user-group.const';

type UseUserGroupsTuple = [TagInfo[] | CheckboxOption[], boolean];

export const useUserGroupOptions = (
	type: 'CheckboxOption' | 'TagInfo',
	includeSpecialGroups: boolean
): UseUserGroupsTuple => {
	const { data: userGroups, isLoading } = useGetUserGroups();

	const userGroupOptions = useMemo(() => {
		const allOptions = [
			...(includeSpecialGroups ? GET_SPECIAL_USER_GROUPS() : []),
			...(userGroups || []),
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
	}, [userGroups, includeSpecialGroups, type]);

	return [userGroupOptions, isLoading];
};
