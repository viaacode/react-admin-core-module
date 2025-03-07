import type { IconName } from '@viaa/avo2-components';
import { Button, ButtonGroup } from '@viaa/avo2-components';
import type { FunctionComponent } from 'react';
import React from 'react';

import type { AlignOption } from '../../../types/content-block.types';

export interface AlignSelectProps {
	onChange: (value: string) => void;
	options: { label: string; value: AlignOption }[];
	value: AlignOption;
}

export const AlignSelect: FunctionComponent<AlignSelectProps> = ({ onChange, options, value }) => {
	return (
		<ButtonGroup>
			{options.map((option) => (
				<Button
					key={`heading-block-align-${option.value}`}
					active={value === option.value}
					icon={`align-${option.value}` as IconName}
					onClick={() => onChange(option.value)}
					title={option.label}
					type="secondary"
				/>
			))}
		</ButtonGroup>
	);
};
