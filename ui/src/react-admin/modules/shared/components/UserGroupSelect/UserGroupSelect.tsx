import type { TagInfo } from '@viaa/avo2-components';
import { CheckboxGroup, FormGroup } from '@viaa/avo2-components';
import clsx from 'clsx';
import { isEmpty, uniq } from 'lodash-es';
import React, {
	type ChangeEvent,
	type FunctionComponent,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import type { UserGroup } from '~modules/user-group/types/user-group.types';

import './UserGroupSelect.scss';
import { Checkbox } from '@meemoo/react-components';
import {
	GET_ALL_CONTENT_USER_GROUP,
	getAllSubgroupIds,
	isSubUserGroup,
} from '~modules/user-group/const/user-group.const';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';

export interface UserGroupSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder?: string;
	values: string[];
	checkedOptions?: string[];
	disabledOptions?: string[];
	enableAllContentOption?: boolean;
	required: boolean;
	onChange: (selectedUserGroupIds: string[]) => void;
	className?: string;
}

export const UserGroupSelect: FunctionComponent<UserGroupSelectProps> = ({
	label,
	error,
	placeholder,
	values,
	checkedOptions = [],
	disabledOptions = [],
	enableAllContentOption,
	onChange,
	required,
	className,
}) => {
	const [userGroupOptions] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];

	const allSubgroupIds = useMemo(() => getAllSubgroupIds(userGroupOptions), [userGroupOptions]);
	const allSubgroupsSelected = useCallback(
		(options: string[]) => allSubgroupIds.every((subgroup) => options.includes(subgroup)),
		[allSubgroupIds]
	);
	const atLeastOneSubgroupSelected = useCallback(
		(options: string[]) => allSubgroupIds.some((subgroup) => options.includes(subgroup)),
		[allSubgroupIds]
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should only execute one time
	useEffect(() => {
		let newValues = [...values, ...checkedOptions];

		if (
			allSubgroupsSelected(newValues) &&
			!newValues.includes(SpecialPermissionGroups.loggedInUsers)
		) {
			// If all subgroups are selected but not the loggedInUsers, then we need to add this
			newValues = [...newValues, SpecialPermissionGroups.loggedInUsers];
		} else if (
			!allSubgroupsSelected(newValues) &&
			newValues.includes(SpecialPermissionGroups.loggedInUsers)
		) {
			// Not all subgroups are selected, so removing loggedInUsers
			newValues = newValues.filter((item) => item !== SpecialPermissionGroups.loggedInUsers);
		}

		onChange(uniq(newValues));
	}, [allSubgroupIds]);

	const visuallyCheckLoggedInUsers = useCallback(
		(userGroupOption: TagInfo) => {
			// Only when this usergroup is loggedInUsers, not all user groups have been selected but at least 1 is
			return (
				userGroupOption.value === SpecialPermissionGroups.loggedInUsers &&
				!allSubgroupsSelected(values) &&
				atLeastOneSubgroupSelected(values)
			);
		},
		[allSubgroupsSelected, atLeastOneSubgroupSelected, values]
	);

	const handleCheckboxChanged = (evt: ChangeEvent<HTMLInputElement>) => {
		const userGroup = evt.target.value;
		const wasChecked = values.includes(userGroup);

		// So we are adding this value
		if (!wasChecked) {
			const newValues = [...values, userGroup];

			// We are adding the loggedInUsers, so adding all subgroups as well
			if (userGroup === SpecialPermissionGroups.loggedInUsers) {
				newValues.push(...allSubgroupIds);
			} else if (allSubgroupsSelected(newValues)) {
				// We are adding a subgroup, so making sure we have the loggedInUsers as well when all subgroups have been selected
				newValues.push(SpecialPermissionGroups.loggedInUsers);
			}
			onChange(uniq(newValues));
		} else {
			// We are removing the loggedInUsers
			if (userGroup === SpecialPermissionGroups.loggedInUsers) {
				// remove all subgroups except the disabled ones
				onChange(
					values.filter((item) => {
						if (item === SpecialPermissionGroups.loggedInUsers) {
							return false;
						}
						if (disabledOptions.includes(item)) {
							return true;
						}
						return !isSubUserGroup(item);
					})
				);
			} else {
				const newValues = values.filter((value) => value !== userGroup);

				// Not all subgroups are selected anymore, so removed the loggedInUsers as well
				if (!allSubgroupsSelected(newValues)) {
					onChange(newValues.filter((value) => value !== SpecialPermissionGroups.loggedInUsers));
				} else {
					onChange(newValues);
				}
			}
		}
	};

	const getLabel = () => {
		const parts = [];
		if (label) {
			parts.push(label);
		}
		if (placeholder && values.length === 0) {
			parts.push(placeholder);
		}
		return parts.join(': ');
	};

	if (isEmpty(userGroupOptions)) {
		return null;
	}

	return (
		<FormGroup
			error={error}
			label={getLabel()}
			required={required}
			className={clsx('c-user-group-select', className)}
		>
			<CheckboxGroup>
				{enableAllContentOption && (
					<Checkbox
						key={SpecialPermissionGroups.allContent}
						label={GET_ALL_CONTENT_USER_GROUP().label}
						value={SpecialPermissionGroups.allContent}
						checked={values.includes(String(SpecialPermissionGroups.allContent))}
						onChange={handleCheckboxChanged}
					></Checkbox>
				)}

				{userGroupOptions.map((userGroupOption) => {
					return (
						<Checkbox
							key={userGroupOption.value}
							label={userGroupOption.label}
							value={userGroupOption.value}
							checked={
								values.includes(String(userGroupOption.value)) ||
								visuallyCheckLoggedInUsers(userGroupOption)
							}
							disabled={disabledOptions.includes(String(userGroupOption.value))}
							onChange={handleCheckboxChanged}
							data-indeterminate={visuallyCheckLoggedInUsers(userGroupOption) || undefined}
							className={clsx('', {
								'u-spacer-left-l': isSubUserGroup(userGroupOption.value),
							})}
						></Checkbox>
					);
				})}
			</CheckboxGroup>
		</FormGroup>
	);
};
