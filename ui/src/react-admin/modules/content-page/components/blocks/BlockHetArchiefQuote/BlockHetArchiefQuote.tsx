import type { DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';

import { Icon } from '~shared/components/Icon/Icon';
import {
	Color,
	type CustomBackground,
	type GradientColor,
} from '../../../types/content-block.types';

import './BlockHetArchiefQuote.scss';

export interface BlockHetArchiefQuoteProps extends DefaultProps {
	quote: string;
	authorName?: string;
	// Optional because content blocks created before this block type existed (the old shared
	// 'QUOTE' block) have no colour fields in their stored componentState, so these arrive
	// undefined when read straight out of the database.
	textColor?: Color;
	frameColor?: Color | GradientColor | CustomBackground;
}

export const BlockHetArchiefQuote: FunctionComponent<BlockHetArchiefQuoteProps> = ({
	className,
	quote,
	authorName,
	// Same defaults as INITIAL_HET_ARCHIEF_QUOTE_COMPONENTS_STATE() in the editorconfig, which
	// only runs for blocks created in the editor, never for stored state read back out.
	textColor = Color.White,
	frameColor = Color.Black,
}) => (
	<figure
		className={clsx('c-block-het-archief-quote', className)}
		style={
			{
				'--text-color': textColor,
				'--frame-color': frameColor,
			} as CSSProperties
		}
	>
		{/* Decorative: the quote itself carries the meaning, so keep it out of the a11y tree */}
		<span className="c-block-het-archief-quote__mark" aria-hidden="true">
			<Icon name="quotes" />
		</span>
		<blockquote className="c-block-het-archief-quote__quote">{quote}</blockquote>
		{authorName && (
			<figcaption className="c-block-het-archief-quote__author">{authorName}</figcaption>
		)}
	</figure>
);
