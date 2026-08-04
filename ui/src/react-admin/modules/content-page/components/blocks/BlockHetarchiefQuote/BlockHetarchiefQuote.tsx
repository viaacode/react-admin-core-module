import type { DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';

import type { Color, CustomBackground, GradientColor } from '../../../types/content-block.types';

import './BlockHetarchiefQuote.scss';

export interface BlockHetarchiefQuoteProps extends DefaultProps {
	quote: string;
	authorName?: string;
	textColor: Color;
	frameColor: Color | GradientColor | CustomBackground;
}

export const BlockHetarchiefQuote: FunctionComponent<BlockHetarchiefQuoteProps> = ({
	className,
	quote,
	authorName,
	textColor,
	frameColor,
}) => (
	<figure
		className={clsx('c-block-hetarchief-quote', className)}
		style={
			{
				'--text-color': textColor,
				'--frame-color': frameColor,
			} as CSSProperties
		}
	>
		<span className="c-block-hetarchief-quote__mark" aria-hidden="true">
			”
		</span>
		<blockquote className="c-block-hetarchief-quote__quote">{quote}</blockquote>
		{authorName && (
			<figcaption className="c-block-hetarchief-quote__author">{authorName}</figcaption>
		)}
	</figure>
);
