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
	type GradientColor,
} from '~modules/content-page/types/content-block.types';
import { ContentPageWidth } from '~modules/content-page/types/content-pages.types.ts';
import Html from '~shared/components/Html/Html.tsx';
import { SanitizePreset } from '~shared/helpers/sanitize/presets';

export interface BlockHighlightTextProps extends DefaultComponentProps {
	content: string;
	highlightColor: Color | GradientColor | CustomBackground;
	backgroundColor: Color | GradientColor | CustomBackground;
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
	// Text colors follow the fill behind the content. Gradients and the meemoo logo both render a
	// white content box, so both take the text colors for white.
	// https://meemoo.atlassian.net/browse/ARC-3848
	const textBoxBackground =
		isGradient || highlightColor === CustomBackground.MeemooLogo ? Color.White : highlightColor;
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
				{/* c-rich-text-editor__content gives the rich text output its standard styling,
				    paragraph spacing included - see BlockRichText */}
				<Html
					className={clsx('c-block-highlight-text__content-text', 'c-rich-text-editor__content', {
						'u-background-text-colors u-background-text-links': hasTextColors,
					})}
					style={
						{
							'--pattern-color': textBoxBackground,
							...textColorVariables,
						} as CSSProperties
					}
					content={content}
					sanitizePreset={SanitizePreset.full}
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
