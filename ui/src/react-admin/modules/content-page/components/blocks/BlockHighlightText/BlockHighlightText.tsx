import React, { type CSSProperties, type FunctionComponent, type ReactElement } from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import './BlockHighligtText.scss';
import { Container } from '@viaa/avo2-components';
import clsx from 'clsx';
import { BlockHeading } from '~content-blocks/BlockHeading';
import type { AlignOption } from '~modules/content-page/types/content-block.types';
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
	return (
		<article
			className={clsx('c-block-highlight-text', 'o-container')}
			style={
				{
					background: backgroundColor,
					'--pattern-color': highlightColor,
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
				{/* No-op on desktop (patterns sit beside the text via CSS); on mobile this
					    is the clip box that caps the pattern at 1/3 screen width - see .scss.
					    Placed here (before the title) only for mobile's source order. */}
				<div className="c-block-highlight-text__pattern-slot c-block-highlight-text__pattern-slot--top">
					<div
						className="c-block-highlight-text__pattern c-block-highlight-text__pattern--left"
						aria-hidden="true"
					/>
				</div>
				{/* Carries the highlight background-color and the text's own breathing-room
					    padding, separate from &__content's padding (which only reserves space
					    for the patterns above/below it on mobile) - see .scss. */}
				<Html className="c-block-highlight-text__content-text" content={content} type="p"></Html>
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
