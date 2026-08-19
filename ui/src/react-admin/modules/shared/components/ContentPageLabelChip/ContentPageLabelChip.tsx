import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import {
	getBackgroundTextColors,
	TEXT_COLOR_WHITE,
} from '~modules/content-page/const/background-text-colors';
import {
	Color,
	CustomBackground,
	type GradientColor,
} from '~modules/content-page/types/content-block.types';

import './ContentPageLabelChip.scss';

export interface ContentPageLabelChipProps {
	label: string;
	// The background colour picked by the admin on the content page label. Not optional: the
	// hetarchief app_content_label.color column is not null with a white default
	color: string;
	className?: string;
	bordered?: boolean;
}

/**
 * The visual label that is generated for a content page label, so meemoo no longer has to draw
 * these into the thumbnail by hand: https://meemoo.atlassian.net/browse/ARC-3818
 */
export const ContentPageLabelChip: FunctionComponent<ContentPageLabelChipProps> = ({
	label,
	color,
	className,
	bordered = false,
}) => {
	if (!label) {
		return null;
	}
	const textColor =
		getBackgroundTextColors(color as Color | GradientColor | CustomBackground)?.primary ??
		TEXT_COLOR_WHITE;

	// The meemoo logo is not a css value, it is a pattern the client fills in. A chip is too small to
	// draw that pattern on, so it renders transparent, like ContentBlockRenderer does for a block
	return (
		<span
			className={clsx(
				'c-content-page-label-chip',
				{ 'c-content-page-label-chip--bordered': bordered },
				className
			)}
			style={{
				background: color === CustomBackground.MeemooLogo ? Color.Transparent : color,
				color: textColor,
			}}
		>
			{label}
		</span>
	);
};
