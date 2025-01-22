import type { TagInfo } from '@viaa/avo2-components';
import { CheckboxGroup, FormGroup } from '@viaa/avo2-components';
import { isEmpty } from 'lodash-es';
import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useEffect } from 'react';

import { Checkbox } from '@meemoo/react-components';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import type { UserGroup } from '~modules/user-group/types/user-group.types';
import { SpecialPermissionGroups } from '~shared/types/authentication.types';

export interface UserGroupSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder?: string;
	values: string[];
	required: boolean;
	onChange: (selectedUserGroupIds: string[]) => void;
}

export const UserGroupSelect: FunctionComponent<UserGroupSelectProps> = ({
	label,
	error,
	placeholder,
	values,
	onChange,
	required,
}) => {
	const [userGroupOptions] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];

	useEffect(() => {
		if (values.length === 0) {
			const defaultValues = [
				SpecialPermissionGroups.loggedOutUsers,
				SpecialPermissionGroups.loggedInUsers,
			];
			const newValues = [...new Set([...values, ...defaultValues])];
			onChange(newValues);
		}
	}, []);

	const handleCheckboxChanged = (evt: ChangeEvent<HTMLInputElement>) => {
		const userGroup = evt.target.value;
		if (values.includes(userGroup)) {
			onChange(values.filter((value) => value !== userGroup));
		} else {
			onChange([...values, userGroup]);
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
			className="c-user-group-select"
		>
			<CheckboxGroup>
				{userGroupOptions.map((userGroupOption, index) => {
					/*The last option is set to checked and disabled,
					this is to target the admin role. This role will always have access.
					TODO: this should be refactored, the database needs a migration that gives these usersGroups a named string for ARC as AVO.
					we then could whitelist these groups here and check for this name instead of the index.
					Ticket: https://meemoo.atlassian.net/browse/ARC-2578
					 */

					const isAdminCheckbox = index === userGroupOptions.length - 1;

					return (
						<Checkbox
							key={userGroupOption.value}
							label={userGroupOption.label}
							value={userGroupOption.value}
							checked={
								isAdminCheckbox || values.includes(String(userGroupOption.value))
							}
							disabled={isAdminCheckbox}
							onChange={handleCheckboxChanged}
						></Checkbox>
					);
				})}
			</CheckboxGroup>
		</FormGroup>
	);
};
