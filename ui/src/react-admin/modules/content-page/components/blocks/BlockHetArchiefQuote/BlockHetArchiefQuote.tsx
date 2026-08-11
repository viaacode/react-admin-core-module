import type { DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React from 'react';

import { Icon } from '~shared/components/Icon/Icon';
import type { Color, CustomBackground, GradientColor } from '../../../types/content-block.types';

import './BlockHetArchiefQuote.scss';

export interface BlockHetArchiefQuoteProps extends DefaultProps {
	quote: string;
	authorName?: string;
	textColor: Color;
	frameColor: Color | GradientColor | CustomBackground;
}

export const BlockHetArchiefQuote: FunctionComponent<BlockHetArchiefQuoteProps> = ({
	className,
	quote,
	authorName,
	textColor,
	frameColor,
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
