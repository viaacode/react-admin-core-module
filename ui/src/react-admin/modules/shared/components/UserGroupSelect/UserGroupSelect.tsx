import type { TagInfo } from '@viaa/avo2-components';
import { CheckboxGroup, FormGroup } from '@viaa/avo2-components';
import { isEmpty, uniq } from 'lodash-es';
import type { ChangeEvent, FunctionComponent } from 'react';
import React, { useEffect } from 'react';

import { Checkbox } from '@meemoo/react-components';
import { useUserGroupOptions } from '~modules/user-group/hooks/useUserGroupOptions';
import type { UserGroup } from '~modules/user-group/types/user-group.types';
import clsx from 'clsx';

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

	useEffect(() => {
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
						></Checkbox>
					);
				})}
			</CheckboxGroup>
		</FormGroup>
	);
};
