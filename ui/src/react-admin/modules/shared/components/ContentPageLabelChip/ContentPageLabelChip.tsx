import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import './ContentPageLabelChip.scss';

export interface ContentPageLabelChipProps {
	label: string;
	// The background colour picked by the admin on the content page label. Not optional: the
	// hetarchief app_content_label.color column is not null with a white default
	color: string;
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

	return (
		<span className={clsx('c-content-page-label-chip', className)} style={{ background: color }}>
			{label}
		</span>
	);
};
