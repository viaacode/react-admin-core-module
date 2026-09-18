import type { DefaultProps } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { CSSProperties, FunctionComponent } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AdminCoreIconName } from '~core/config/config.types';
import { Icon } from '~shared/components/Icon/Icon';
import { isServerSideRendering } from '~shared/helpers/routing/is-server-side-rendering';
import {
	Color,
	type CustomBackground,
	type GradientColor,
} from '../../../types/content-block.types';

import './BlockHetArchiefQuote.scss';

// The frame's desktop bleed (--bleed, set in the .scss from $bleed) must keep at least this much
// clearance from the true screen edge - see updateIsStacked below. Read from the frame's own
// computed style rather than duplicating $bleed's value here, since drift between the two would
// silently break the measurement.
const MIN_EDGE_GAP_REM = 1.5;

export interface BlockHetArchiefQuoteProps extends DefaultProps {
	quote: string;
	authorName?: string;
	// Optional because content blocks created before this block type existed (the old shared
	// 'QUOTE' block) have no colour fields in their stored componentState, so these arrive
	// undefined when read straight out of the database.
	textColor?: Color | GradientColor | CustomBackground;
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
}) => {
	const figureRef = useRef<HTMLElement>(null);
	// Whether the frame is bled (see .scss) far enough to come within MIN_EDGE_GAP_REM of the
	// true screen edge. Starts false (bled) to match the block's default, unmodified markup, so
	// server- and first-client-render stay identical - see updateIsStacked for how it's kept
	// correct from there on.
	const [isStacked, setIsStacked] = useState(false);

	const updateIsStacked = useCallback(() => {
		const figureEl = figureRef.current;
		if (!figureEl || isServerSideRendering()) {
			return;
		}

		const style = getComputedStyle(figureEl);
		const rootFontSize =
			Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
		// --bleed/--stack-padding-x (set in the .scss) come back as unresolved rem strings, since
		// computed custom properties aren't resolved to px like ordinary properties are.
		const remVarToPx = (name: string) =>
			(Number.parseFloat(style.getPropertyValue(name)) || 0) * rootFontSize;
		const bleedPx = remVarToPx('--bleed');
		const stackPaddingPx = remVarToPx('--stack-padding-x');
		const minEdgeGapPx = MIN_EDGE_GAP_REM * rootFontSize;

		// Whichever layout is currently on screen has its own bleed (bled: -bleedPx margin,
		// stacked: -stackPaddingPx margin - see .scss), which has to be added back to get from
		// the frame's own rendered edge to the underlying text column's true position, before
		// re-deriving what the gap would be if the (other) desktop bleed were applied instead.
		const currentBleedPx = figureEl.classList.contains('c-block-het-archief-quote--stacked')
			? stackPaddingPx
			: bleedPx;

		const rect = figureEl.getBoundingClientRect();
		const columnLeft = rect.left + currentBleedPx;
		const columnRightGap = window.innerWidth - rect.right + currentBleedPx;

		const leftGapIfBled = columnLeft - bleedPx;
		const rightGapIfBled = columnRightGap - bleedPx;

		setIsStacked(Math.min(leftGapIfBled, rightGapIfBled) < minEdgeGapPx);
	}, []);

	useEffect(() => {
		if (isServerSideRendering()) {
			return;
		}

		updateIsStacked();
		window.addEventListener('resize', updateIsStacked);
		return () => window.removeEventListener('resize', updateIsStacked);
	}, [updateIsStacked]);

	return (
		<figure
			ref={figureRef}
			className={clsx(
				'c-block-het-archief-quote',
				{ 'c-block-het-archief-quote--stacked': isStacked },
				className
			)}
			style={
				{
					'--text-color': textColor,
					'--frame-color': frameColor,
				} as CSSProperties
			}
		>
			{/* Decorative: the quote itself carries the meaning, so keep it out of the a11y tree */}
			<span className="c-block-het-archief-quote__mark" aria-hidden="true">
				<Icon name={AdminCoreIconName.Quotes} />
			</span>
			<blockquote className="c-block-het-archief-quote__quote">{quote}</blockquote>
			{authorName && (
				<figcaption className="c-block-het-archief-quote__author">{authorName}</figcaption>
			)}
		</figure>
	);
};
