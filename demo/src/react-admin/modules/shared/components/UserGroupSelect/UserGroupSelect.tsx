import { CheckboxGroup, FormGroup, TagInfo } from '@viaa/avo2-components';
import { isEmpty, remove } from 'lodash-es';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { useUserGroupOptions } from '../../../content-page/hooks/useUserGroupOptions';
import { Checkbox } from '@meemoo/react-components';

export interface UserGroupSelectProps {
	label: string | undefined;
	error: string | undefined;
	placeholder: string;
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
	const [userGroupOptions] = useUserGroupOptions('TagInfo', true) as [TagInfo[], boolean];

	const handleCheckboxChanged = (evt: ChangeEvent<HTMLInputElement>) => {
		const userGroup = evt.target.value;
		if (values.includes(userGroup)) {
			const newValues = [...values];
			remove(newValues, (value) => value === userGroup);
			onChange(newValues);
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
		<FormGroup error={error} label={getLabel()} required={required}>
			<CheckboxGroup>
				{userGroupOptions.map((userGroupOption) => {
					return (
						<Checkbox
							key={userGroupOption.value}
							label={userGroupOption.label}
							value={userGroupOption.value}
							checked={values.includes(String(userGroupOption.value))}
							onChange={handleCheckboxChanged}
						></Checkbox>
					);
				})}
			</CheckboxGroup>
		</FormGroup>
	);
};
