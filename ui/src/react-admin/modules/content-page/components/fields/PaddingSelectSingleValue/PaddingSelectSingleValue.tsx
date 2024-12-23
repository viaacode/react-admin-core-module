import type { SelectOption, SpacerOption } from '@viaa/avo2-components';
import { Select } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';

import { tHtml } from '~shared/helpers/translation-functions';

export interface PaddingSelectSingleValueProps {
	onChange: (value: SpacerOption) => void;
	value: SpacerOption;
}

export const PaddingSelectSingleValue: FunctionComponent<PaddingSelectSingleValueProps> = ({
	onChange,
	value,
}) => {
	const generateOptions = () =>
		[
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___geen'
				),
				value: 'none',
			},
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___klein'
				),
				value: 'small',
			},
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___medium'
				),
				value: 'medium',
			},
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___groot'
				),
				value: 'large',
			},
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___extra-groot'
				),
				value: 'extra-large',
			},
		] as SelectOption<SpacerOption>[];

	const handleChange = (newValue: SpacerOption) => {
		onChange(newValue);
	};

	return (
		<Select
			onChange={(value: string) => handleChange(value as SpacerOption)}
			options={generateOptions()}
			value={value}
		/>
	);
};
