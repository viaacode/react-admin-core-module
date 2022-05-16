import { yupResolver } from '@hookform/resolvers/yup';
import { FormControl, TagsInput, TextInput } from '@meemoo/react-components';
import React, { FC } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { NAVIGATION_ELEMENT_FORM_SCHEMA } from './NavigationElementForm.const';
import { NavigationElementFormProps } from './NavigationElementForm.types';

const NavigationElementForm: FC<NavigationElementFormProps> = ({ placementOptions }) => {
	const { control } = useForm({
		resolver: yupResolver(NAVIGATION_ELEMENT_FORM_SCHEMA),
	});

	return (
		<div className="c-admin-navigation__element-edit-form">
			<FormControl className="u-mb-16" label="Navigatie">
				<Controller
					control={control}
					name="placement"
					render={({ field }) => (
						<TagsInput
							name={field.name}
							onBlur={field.onBlur}
							onChange={field.onChange}
							value={field.value}
							isMulti={false}
							options={placementOptions}
							placeholder="Selecteer of maak een navigatie aan"
						/>
					)}
				/>
			</FormControl>

			<FormControl className="u-mb-16" label="Naam navigatie-item">
				<Controller
					control={control}
					name="label"
					render={({ field }) => <TextInput {...field} />}
				/>
			</FormControl>

			<FormControl label="Tooltip">
				<Controller
					control={control}
					name="tooltip"
					render={({ field }) => <TextInput {...field} />}
				/>
			</FormControl>
		</div>
	);
};

export default NavigationElementForm;
