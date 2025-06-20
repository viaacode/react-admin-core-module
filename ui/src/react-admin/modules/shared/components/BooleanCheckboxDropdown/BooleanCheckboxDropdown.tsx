import type { FunctionComponent } from 'react';
import React from 'react';

import { NULL_FILTER } from '../../helpers/filters';
import type { CheckboxOption } from '../CheckboxDropdownModal/CheckboxDropdownModal';
import { CheckboxDropdownModal } from '../CheckboxDropdownModal/CheckboxDropdownModal';

import { tText } from '~shared/helpers/translation-functions';

export interface BooleanCheckboxDropdownProps {
	label: string;
	id: string;
	disabled?: boolean;
	value: string[];
	trueLabel?: string;
	falseLabel?: string;
	trueValue?: string;
	falseValue?: string;
	includeEmpty?: boolean;
	onChange: (value: string[], id: string) => void;
	searchInputAriaLabel: string;
}

const BooleanCheckboxDropdown: FunctionComponent<BooleanCheckboxDropdownProps> = ({
	label,
	id,
	disabled,
	value = [],
	trueLabel,
	falseLabel,
	trueValue = 'true',
	falseValue = 'false',
	includeEmpty = false,
	onChange,
	searchInputAriaLabel,
}) => {
	const getOptions = (): CheckboxOption[] => {
		return [
			{
				label:
					trueLabel ||
					tText('shared/components/boolean-checkbox-dropdown/boolean-checkbox-dropdown___ja'),
				id: trueValue,
				checked: value.includes(trueValue),
			},
			{
				label:
					falseLabel ||
					tText('shared/components/boolean-checkbox-dropdown/boolean-checkbox-dropdown___nee'),
				id: falseValue,
				checked: value.includes(falseValue),
			},
			...(includeEmpty
				? [
						{
							label: tText('admin/users/user___leeg'),
							id: NULL_FILTER,
							checked: value.includes(NULL_FILTER),
						},
					]
				: []),
		];
	};

	// Methods
	const handleCheckboxChange = (selectedCheckboxes: string[]) => {
		if (selectedCheckboxes.length === 0 || selectedCheckboxes.length === (includeEmpty ? 3 : 2)) {
			onChange([], id);
		} else {
			onChange(selectedCheckboxes, id);
		}
	};

	return (
		<CheckboxDropdownModal
			label={label}
			id={id}
			options={getOptions()}
			onChange={handleCheckboxChange}
			disabled={disabled}
			searchInputAriaLabel={searchInputAriaLabel}
		/>
	);
};

export default BooleanCheckboxDropdown;
