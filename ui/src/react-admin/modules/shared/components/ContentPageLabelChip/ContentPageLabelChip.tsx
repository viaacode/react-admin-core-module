import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { CONTENT_PAGE_LABEL_COLORS_WITH_WHITE_TEXT } from '~modules/content-page/const/get-color-options';
import { Color, CustomBackground } from '~modules/content-page/types/content-block.types';

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

	// The meemoo logo is not a css value, it is a pattern the client fills in. A chip is too small to
	// draw that pattern on, so it renders transparent, like ContentBlockRenderer does for a block
	return (
		<span
			className={clsx('c-content-page-label-chip', className)}
			style={{
				background: color === CustomBackground.MeemooLogo ? Color.Transparent : color,
				color: CONTENT_PAGE_LABEL_COLORS_WITH_WHITE_TEXT.includes(color)
					? Color.White
					: Color.Black,
			}}
		>
			{label}
		</span>
	);
};
