import { Accordion, DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { FunctionComponent, useState } from 'react';

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
	const [accordionsOpen, setAccordionsOpen] = useState<{ [key: string]: boolean }>(
		elements.reduce((acc, _curr, i) => ({ ...acc, [generateKey(i)]: false }), {})
	);

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
							setAccordionsOpen({ ...accordionsOpen, [key]: !accordionsOpen[key] })
						}
					>
						<BlockRichText elements={{ content }} />
					</Accordion>
				);
			})}
		</div>
	);
};
