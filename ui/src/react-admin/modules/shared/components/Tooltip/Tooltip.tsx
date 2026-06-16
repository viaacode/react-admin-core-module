import type { Placement } from '@floating-ui/react';
import {
	Tooltip as ReactCompTooltip,
	TooltipContent,
	TooltipTrigger,
	useSlot,
} from '@meemoo/react-components';
import { clsx } from 'clsx';
import React, { type CSSProperties, type FC, type ReactNode } from 'react';
import { isAvo } from '~shared/helpers/is-avo.ts';

import './Tooltip.scss';

export { TooltipContent, TooltipTrigger } from '@meemoo/react-components';

export interface TooltipProps {
	children: ReactNode;
	position?: Placement;
	offset?: number;
	contentClassName?: string;
	style?: CSSProperties;
}

export const Tooltip: FC<TooltipProps> = ({
	children,
	position = 'top',
	offset,
	contentClassName,
	style,
}) => {
	const triggerElement = useSlot(TooltipTrigger, children);
	const contentElement = useSlot(TooltipContent, children);
	return (
		<ReactCompTooltip
			position={position}
			offset={offset}
			arrowStrokeWidth={1}
			// Setting styles like this as a workaround since styling depends on client that consumes the admin-core
			// And styling cannot be done purely with css because of the floating ui tooltip arrow styles
			arrowStrokeColor={isAvo() ? '#557891' : 'black'}
			arrowFillColor={isAvo() ? '#edeff2' : 'black'}
			contentClassName={clsx(isAvo() ? 'c-tooltip-avo' : 'c-tooltip-hetarchief', contentClassName)}
			style={style}
		>
			<TooltipTrigger>{triggerElement}</TooltipTrigger>
			<TooltipContent>{contentElement}</TooltipContent>
		</ReactCompTooltip>
	);
};
