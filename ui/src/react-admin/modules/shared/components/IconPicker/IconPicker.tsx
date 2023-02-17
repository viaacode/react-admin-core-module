import { Flex, Spacer } from '@viaa/avo2-components';
import clsx from 'clsx';
import { FunctionComponent } from 'react';
import Select, { Props as ReactSelectProps } from 'react-select';
import { AdminConfigManager } from '~core/config';

import './IconPicker.scss';

export const IconPicker: FunctionComponent<ReactSelectProps> = ({
	className,
	isClearable = true,
	isSearchable = true,
	noOptionsMessage = ({ inputValue }) => `Geen iconen gevonden: ${inputValue}`,
	placeholder = '',
	...rest
}) => {
	const Icon = AdminConfigManager.getConfig().icon?.component;

	const renderLabel = (option: any) => (
		<Flex>
			{Icon && <Icon name={option?.value} />}
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
