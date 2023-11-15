import { CheckboxGroup, FormGroup, TagInfo } from '@viaa/avo2-components';
import { TagInfoSchema } from '@viaa/avo2-components/dist/components/TagsInput/TagsInput';
import { isEmpty, sortBy } from 'lodash-es';
import React, { ChangeEvent, FunctionComponent } from 'react';

import { Checkbox } from '@meemoo/react-components';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import { UserGroup } from '~modules/user-group/types/user-group.types';

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
	const [userGroupOptions] = useUserGroupOptions('TagInfo', true, false) as [
		TagInfo[],
		UserGroup[],
		boolean,
	];

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

	/**
	 * sort the user groups in a specific order
	 * https://meemoo.atlassian.net/browse/ARC-1999
	 * @param userGroups
	 */
	const customSortUserGroups = (userGroups: TagInfoSchema[]) => {
		return sortBy(userGroups, (userGroup) => {
			const label = userGroup.label.toLowerCase();
			if (label.includes('kiosk')) {
				return '1-' + label;
			} else if (label.includes('meemoo')) {
				return '2-' + label;
			} else if (label.includes('cp')) {
				return '3-' + label;
			} else if (label.includes('bezoeker')) {
				return '4-' + label;
			} else {
				return '0-' + label;
			}
		});
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
				{customSortUserGroups(userGroupOptions).map((userGroupOption) => {
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
