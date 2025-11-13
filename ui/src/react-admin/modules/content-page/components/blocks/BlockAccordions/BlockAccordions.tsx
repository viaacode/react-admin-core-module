import type { DefaultProps } from '@viaa/avo2-components';
import { Accordion } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';

import { BlockRichText } from '../BlockRichText/BlockRichText';

export interface BlockAccordionsProps extends DefaultProps {
	elements: { title: string; content: string }[];
}

export const BlockAccordions: FunctionComponent<BlockAccordionsProps> = ({
	className,
	elements,
}) => {
	// Methods
	const generateKey = (i: number) => `block-accordion-${i}`;

	// Hooks
	const initialAccordionsState = () => {
		const state: { [key: string]: boolean } = {};
		elements.forEach((_curr, i) => {
			state[generateKey(i)] = false;
		});
		return state;
	};
	const [accordionsOpen, setAccordionsOpen] = useState<{
		[key: string]: boolean;
	}>(initialAccordionsState);

	// Render
	return (
		<div className={clsx(className, 'c-block-accordions')}>
			{elements.map(({ content, title }, index) => {
				const key = generateKey(index);

				return (
					<Accordion
						key={key}
						isOpen={accordionsOpen[key]}
						title={title}
						onToggle={() =>
							setAccordionsOpen({
								...accordionsOpen,
								[key]: !accordionsOpen[key],
							})
						}
					>
						<BlockRichText elements={{ content }} />
					</Accordion>
				);
			})}
		</div>
	);
};
