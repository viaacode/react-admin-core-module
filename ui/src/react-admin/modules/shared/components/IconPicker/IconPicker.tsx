import { Flex, Spacer } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import type { Props as ReactSelectProps } from 'react-select';
import Select from 'react-select';
import { Icon } from '~shared/components/Icon';

import './IconPicker.scss';

export const IconPicker: FunctionComponent<ReactSelectProps> = ({
	className,
	isClearable = true,
	isSearchable = true,
	noOptionsMessage = ({ inputValue }) => `Geen iconen gevonden: ${inputValue}`,
	placeholder = '',
	...rest
}) => {
	// biome-ignore lint/suspicious/noExplicitAny: todo
	const renderLabel = (option: any) => (
		<Flex>
			{<Icon name={option?.value} />}
			<Spacer margin="left">{option?.label as string}</Spacer>
		</Flex>
	);

	return (
		<Select
			className={clsx(className, 'c-icon-picker')}
			isClearable={isClearable}
			isSearchable={isSearchable}
			noOptionsMessage={noOptionsMessage}
			placeholder={placeholder}
			{...rest}
			classNamePrefix="react-select"
			formatOptionLabel={renderLabel}
		/>
	);
};
