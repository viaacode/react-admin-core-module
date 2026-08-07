import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import { Color } from '~modules/content-page/types/content-block.types';
import { getReadableTextColor } from './get-readable-text-color';

import './ContentPageLabelChip.scss';

export interface ContentPageLabelChipProps {
	label: string;
	// The background colour picked by the admin on the content page label. Falls back to the
	// database default so the chip is never a transparent box with unreadable white text
	color: string | undefined;
	className?: string;
}

/**
 * The visual label that is generated for a content page label, so meemoo no longer has to draw
 * these into the thumbnail by hand: https://meemoo.atlassian.net/browse/ARC-3818
 */
export const ContentPageLabelChip: FunctionComponent<ContentPageLabelChipProps> = ({
	label,
	color,
	className,
}) => {
	if (!label) {
		return null;
	}

	const backgroundColor = color || Color.White;

	return (
		<span
			className={clsx('c-content-page-label-chip', className)}
			style={{ backgroundColor, color: getReadableTextColor(backgroundColor) }}
		>
			{label}
		</span>
	);
};
