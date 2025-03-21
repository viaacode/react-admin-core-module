import type { TagInfo } from '@viaa/avo2-components';
import { CheckboxGroup, FormGroup } from '@viaa/avo2-components';
import { isEmpty, uniq } from 'lodash-es';
import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useEffect } from 'react';

import { Checkbox } from '@meemoo/react-components';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import type { UserGroup } from '~modules/user-group/types/user-group.types';

export interface UserGroupSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder?: string;
	values: string[];
	defaultCheckedOptions?: string[];
	lockedOptions?: string[];
	required: boolean;
	onChange: (selectedUserGroupIds: string[]) => void;
}

export const UserGroupSelect: FunctionComponent<UserGroupSelectProps> = ({
	label,
	error,
	placeholder,
	values,
	defaultCheckedOptions = [],
	lockedOptions = [],
	onChange,
	required,
}) => {
	const [userGroupOptions] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];

	useEffect(() => {
		const checkedOptions = [];
		if (values.length === 0 && defaultCheckedOptions.length > 0) {
			checkedOptions.push(...defaultCheckedOptions);
		}
		onChange(uniq([...values, ...checkedOptions]));
		// Only execute this effect once
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
				{userGroupOptions.map((userGroupOption) => {
					return (
						<Checkbox
							key={userGroupOption.value}
							label={userGroupOption.label}
							value={userGroupOption.value}
							checked={values.includes(String(userGroupOption.value))}
							disabled={lockedOptions.includes(String(userGroupOption.value))}
							onChange={handleCheckboxChanged}
						></Checkbox>
					);
				})}
			</CheckboxGroup>
		</FormGroup>
	);
};
