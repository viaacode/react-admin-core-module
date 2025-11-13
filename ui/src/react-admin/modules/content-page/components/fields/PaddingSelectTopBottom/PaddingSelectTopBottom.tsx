import type { SelectOption, SpacerOption } from '@viaa/avo2-components';
import { Form, FormGroup, Select } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { PaddingFieldState } from '../../../types/content-block.types';

import { tHtml } from '~shared/helpers/translation-functions';

import './PaddingSelectTopBottom.scss';

export interface PaddingSelectProps {
	onChange: (value: PaddingFieldState) => void;
	value: PaddingFieldState;
}

type PaddingDirection = 'top' | 'bottom';

export const PaddingSelectTopBottom: FunctionComponent<PaddingSelectProps> = ({
	onChange,
	value,
}) => {
	const generateOptions = (direction: PaddingDirection) =>
		[
			{
				label: tHtml('admin/content-block/components/fields/padding-select/padding-select___geen'),
				value: 'none',
			},
			{
				label: tHtml('admin/content-block/components/fields/padding-select/padding-select___klein'),
				value: `${direction}-small`,
			},
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___medium'
				),
				value: `${direction}`,
			},
			{
				label: tHtml('admin/content-block/components/fields/padding-select/padding-select___groot'),
				value: `${direction}-large`,
			},
			{
				label: tHtml(
					'admin/content-block/components/fields/padding-select/padding-select___extra-groot'
				),
				value: `${direction}-extra-large`,
			},
		] as SelectOption<SpacerOption>[];

	const handleChange = (newValue: string, direction: PaddingDirection) => {
		onChange({ ...value, [direction]: newValue });
	};

	return (
		<Form type="inline" className="c-padding-select">
			<FormGroup label="Boven">
				<Select
					onChange={(value: string) => handleChange(value, 'top')}
					options={generateOptions('top')}
					value={value.top}
				/>
			</FormGroup>
			<FormGroup label="Onder">
				<Select
					onChange={(value: string) => handleChange(value, 'bottom')}
					options={generateOptions('bottom')}
					value={value.bottom}
				/>
			</FormGroup>
		</Form>
	);
};
