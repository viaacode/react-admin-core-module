import React, { type CSSProperties, type FunctionComponent, type ReactElement } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHighligtText.scss';
import { Container } from '@viaa/avo2-components';
import clsx from 'clsx';
import { getBackgroundTextColorVariables } from '~modules/content-page/const/background-text-colors.ts';
import {
	Color,
	ColorSelectGradientColors,
	CustomBackground,
} from '~modules/content-page/types/content-block.types';
import { ContentPageWidth } from '~modules/content-page/types/content-pages.types.ts';
import Html from '~shared/components/Html/Html.tsx';

export interface BlockHighlightTextProps extends DefaultComponentProps {
	content: string;
	highlightColor: string;
	backgroundColor: string;
	pageWidth?: string;
}

export const BlockHighlightText: FunctionComponent<BlockHighlightTextProps> = ({
	content,
	highlightColor,
	backgroundColor,
	pageWidth,
}): ReactElement => {
	const isGradient = highlightColor.includes('gradient');
	const patternColor =
		highlightColor === CustomBackground.MeemooLogo
			? Color.Transparent
			: ((ColorSelectGradientColors as Record<string, string>)[highlightColor] ?? highlightColor);
	// The text sits inside the highlighted box, so its WCAG text colors follow the box background
	// rather than the block background: the highlight color, except for a gradient, which renders the
	// box white (see --pattern-color below). The meemoo logo renders it transparent, which design
	// specified no colors for, so that keeps the inherited text color.
	// https://meemoo.atlassian.net/browse/ARC-3848
	const textBoxBackground = isGradient ? Color.White : patternColor;
	const textColorVariables = getBackgroundTextColorVariables(textBoxBackground);
	const hasTextColors = Object.keys(textColorVariables).length > 0;

	return (
		<article
			className={clsx('c-block-highlight-text', 'o-container')}
			style={
				{
					background: backgroundColor,
					'--pattern-color': patternColor,
				} as CSSProperties
			}
		>
			<Container
				mode="horizontal"
				size={
					pageWidth?.toUpperCase() === ContentPageWidth.EXTRA_LARGE
						? undefined
						: (pageWidth?.toLowerCase() as 'medium' | 'large')
				}
				className={clsx('c-block-highlight-text__content')}
			>
				<div className="c-block-highlight-text__pattern-slot c-block-highlight-text__pattern-slot--top">
					<div
						className="c-block-highlight-text__pattern c-block-highlight-text__pattern--left"
						aria-hidden="true"
					/>
				</div>
				<Html
					className={clsx('c-block-highlight-text__content-text', {
						'u-text-primary': hasTextColors,
					})}
					style={
						{
							'--pattern-color': textBoxBackground,
							...textColorVariables,
						} as CSSProperties
					}
					content={content}
					type="p"
				/>
				<div className="c-block-highlight-text__pattern-slot c-block-highlight-text__pattern-slot--bottom">
					<div
						className="c-block-highlight-text__pattern c-block-highlight-text__pattern--right"
						aria-hidden="true"
					/>
				</div>
			</Container>
		</article>
	);
};
