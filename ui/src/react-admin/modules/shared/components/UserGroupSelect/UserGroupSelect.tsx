import { Checkbox } from '@meemoo/react-components';
import type { TagInfo } from '@viaa/avo2-components';
import { CheckboxGroup, FormGroup } from '@viaa/avo2-components';
import clsx from 'clsx';
import { isEmpty, uniq } from 'lodash-es';
import React, {
	type ChangeEvent,
	type FunctionComponent,
	type MouseEvent,
	useEffect,
	useMemo,
} from 'react';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import type { UserGroup } from '~modules/user-group/types/user-group.types';

import './UserGroupSelect.scss';
import { ToastType } from '~core/config';
import { getAllSubgroupIds, isSubUserGroup } from '~modules/user-group/const/user-group.const';
import { showToast } from '~shared/helpers/show-toast';
import { tText } from '~shared/helpers/translation-functions';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';

export interface UserGroupSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder?: string;
	values: string[];
	checkedOptions?: string[];
	disabledOptions?: string[];
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
	onChange,
	required,
	className,
}) => {
	const [userGroupOptions] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];

	const canDisabledLoggedInGroup = !disabledOptions.some(isSubUserGroup);
	const allSubgroupIds = useMemo(() => getAllSubgroupIds(userGroupOptions), [userGroupOptions]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: should only execute one time
	useEffect(() => {
		const newValues = [...values, ...checkedOptions];

		if (
			newValues.some(isSubUserGroup) &&
			!newValues.includes(SpecialPermissionGroups.loggedInUsers)
		) {
			// If there are subgroups selected but not the loggedInUsers, then we need to add this
			newValues.push(SpecialPermissionGroups.loggedInUsers);
		} else if (
			!newValues.some(isSubUserGroup) &&
			newValues.includes(SpecialPermissionGroups.loggedInUsers)
		) {
			// If the loggedInUsers are selected but no subgroups
			newValues.push(...allSubgroupIds);
		}

		onChange(uniq(newValues));
	}, [allSubgroupIds]);

	const handleCheckboxChanged = (evt: ChangeEvent<HTMLInputElement>) => {
		const userGroup = evt.target.value;
		const wasChecked = values.includes(userGroup);

		// So we are adding this value
		if (!wasChecked) {
			const newValues = [...values, userGroup];

			// We are adding the loggedInUsers, so adding all subgroups as well
			if (userGroup === SpecialPermissionGroups.loggedInUsers) {
				newValues.push(...allSubgroupIds);
			} else if (isSubUserGroup(userGroup)) {
				// We are adding a subgroup, so making sure we have the loggedInUsers as well
				newValues.push(SpecialPermissionGroups.loggedInUsers);
			}
			onChange(uniq(newValues));
		} else {
			// We are removing the loggedInUsers
			if (userGroup === SpecialPermissionGroups.loggedInUsers) {
				// remove all subgroups as well when no subgroup is disabled
				if (canDisabledLoggedInGroup) {
					onChange(values.filter((value) => ![userGroup, ...allSubgroupIds].includes(value)));
				}
			} else if (isSubUserGroup(userGroup)) {
				// So we are trying to remove a subgroup
				const newValues = values.filter((value) => value !== userGroup);

				// We still have other subgroups, so we can only remove this specific one
				if (newValues.some((value) => isSubUserGroup(value))) {
					onChange(newValues);
				} else {
					// No other subgroups are selected anymore, so we are remove the loggedInUsers as well
					onChange(newValues.filter((value) => value !== SpecialPermissionGroups.loggedInUsers));
				}
			} else {
				// removing the option
				onChange(values.filter((value) => value !== userGroup));
			}
		}
	};

	const handleCheckboxClick = (evt: MouseEvent<HTMLInputElement>) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const userGroup = evt.target.value;
		const wasChecked = values.includes(userGroup);

		// In some cases we try to remove the loggedInUsers, but there is an option that is preventing the deselection of this
		if (
			userGroup === SpecialPermissionGroups.loggedInUsers &&
			!canDisabledLoggedInGroup &&
			wasChecked
		) {
			showToast({
				description: tText('Je kan dit niet uitvinken daar een rol niet uitgevinkt kan worden'),
				type: ToastType.INFO,
			});
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
				{userGroupOptions.map((userGroupOption) => {
					return (
						<Checkbox
							key={userGroupOption.value}
							label={userGroupOption.label}
							value={userGroupOption.value}
							checked={values.includes(String(userGroupOption.value))}
							disabled={disabledOptions.includes(String(userGroupOption.value))}
							onChange={handleCheckboxChanged}
							onClick={handleCheckboxClick}
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
