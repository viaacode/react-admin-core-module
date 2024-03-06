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

	const USER_GROUP_ORDER = [
		// Hetarchief
		'kiosk',
		'meemoo',
		'cp beheerder',
		'bezoeker',
		'meemoo beheerder',
		// AVO
		'leerling',
		'lesgever',
		'student lesgever',
		'lesgever secundair',
		'student lesgever secundair',
		'educatieve auteur',
		'educatieve uitgever',
		'educatieve partner',
		'contentpartner',
		'redacteur',
		'eindredacteur',
		'medewerker meemoo',
		'beheerder',
	];

	/**
	 * sort the user groups in a specific order
	 * https://meemoo.atlassian.net/browse/ARC-1999
	 * @param userGroups
	 */
	const customSortUserGroups = (userGroups: TagInfoSchema[]) => {
		return sortBy(userGroups, (userGroup) => {
			const label = userGroup.label.toLowerCase();
			let index = USER_GROUP_ORDER.findIndex((userGroupName) => userGroupName === label);
			if (index === -1) {
				index = 0;
			}

			return `${String(index).padStart(2, '0')}-${label}`;
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
