import { Flex, Spacer } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';
import type { Props } from 'react-select';
import Select from 'react-select';

import './ColorSelect.scss';
import type { GradientColor } from '~modules/content-page/types/content-block.types';
import { ColorSelectGradientColors } from '~modules/content-page/types/content-block.types';
import type { ReactSelectOption } from '~modules/shared/types';

export interface ColorOption {
	label: string;
	value: string;
	color?: string; // Defaults to value for the hex color code
}

export interface ColorSelectProps extends Props {
	options: ColorOption[];
}

export const ColorSelect: FunctionComponent<ColorSelectProps> = ({
	className,
	noOptionsMessage = ({ inputValue }) => `Geen kleuren gevonden: ${inputValue}`,
	placeholder = '',
	options,
	...rest
}) => {
	const renderLabel = ({ label, value }: ReactSelectOption<string>): ReactNode => {
		const option: ColorOption | undefined = options.find((option) => option.value === value);
		const isGradient = option?.color?.includes('gradient') || option?.value?.includes('gradient');
		const background = isGradient
			? ColorSelectGradientColors[
					(option?.color as GradientColor) || (option?.value as GradientColor)
				]
			: option?.color || option?.value;

		return (
			<div key={`color-select-${label}-${value}`}>
				<Flex>
					{!!background && <div className={'c-color-select__preview'} style={{ background }} />}
					{!!label && <Spacer margin="left-small">{label}</Spacer>}
				</Flex>
			</div>
		);
	};

	return (
		<Select
			className={clsx(className, 'c-color-select')}
			noOptionsMessage={noOptionsMessage}
			placeholder={placeholder}
			options={options}
			{...rest}
			classNamePrefix="react-select"
			formatOptionLabel={(data: unknown) => renderLabel(data as ReactSelectOption<string>)}
		/>
	);
};
