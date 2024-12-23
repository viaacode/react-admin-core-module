import type { AlignOptions, DefaultProps, HeadingType } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent, ReactNode } from 'react';
import React from 'react';

import './BlockHeading.scss';

export interface BlockHeadingProps extends DefaultProps {
	type: HeadingType;
	color?: string;
	children: ReactNode;
	align?: AlignOptions;
	onClick?: (() => void) | undefined;
}

export const BlockHeading: FunctionComponent<BlockHeadingProps> = ({
	type: Type,
	color,
	children,
	align = 'left',
	onClick,
	className,
	style = {},
}) => (
	<Type
		className={clsx(className, `c-heading c-${Type}`, {
			[`u-text-${align}`]: align !== 'left',
		})}
		onClick={onClick}
		style={color ? { ...style, color } : style}
	>
		{children}
	</Type>
);
