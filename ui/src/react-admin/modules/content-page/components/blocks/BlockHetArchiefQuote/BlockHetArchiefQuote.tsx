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
import { computeIsStacked, STACKED_CLASS } from './BlockHetArchiefQuote.helpers';

import './BlockHetArchiefQuote.scss';

export interface BlockHetArchiefQuoteProps extends DefaultProps {
	quote: string;
	authorName?: string;
	// Optional: blocks migrated from the old shared 'QUOTE' block predate these fields.
	textColor?: Color | GradientColor | CustomBackground;
	frameColor?: Color | GradientColor | CustomBackground;
}

export const BlockHetArchiefQuote: FunctionComponent<BlockHetArchiefQuoteProps> = ({
	className,
	quote,
	authorName,
	// Matches INITIAL_HET_ARCHIEF_QUOTE_COMPONENTS_STATE()'s defaults in the editorconfig.
	textColor = Color.White,
	frameColor = Color.Black,
}) => {
	const figureRef = useRef<HTMLElement>(null);
	// Starts bled (false) to match the default markup, so SSR and first render don't mismatch.
	const [isStacked, setIsStacked] = useState(false);

	const updateIsStacked = useCallback(() => {
		const figureEl = figureRef.current;
		if (!figureEl || isServerSideRendering()) {
			return;
		}

		// clientWidth, not window.innerWidth - see computeIsStacked's viewportWidth note.
		setIsStacked(computeIsStacked(figureEl, document.documentElement.clientWidth));
	}, []);

	useEffect(() => {
		if (isServerSideRendering() || !figureRef.current) {
			return;
		}

		// Coalesces bursts of resize/observer events to at most one measurement per frame.
		let rafId = 0;
		const scheduleUpdate = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(updateIsStacked);
		};

		// window 'resize' covers the viewport shrinking; ResizeObserver covers the figure's own box
		// resizing without a window resize (e.g. dragging the admin preview panel's flex-basis).
		// Its first notification duplicates the updateIsStacked() call below, so skip it.
		let isInitialObservation = true;
		const resizeObserver = new ResizeObserver(() => {
			if (isInitialObservation) {
				isInitialObservation = false;
				return;
			}
			scheduleUpdate();
		});
		resizeObserver.observe(figureRef.current);

		updateIsStacked();
		window.addEventListener('resize', scheduleUpdate);
		return () => {
			window.removeEventListener('resize', scheduleUpdate);
			resizeObserver.disconnect();
			cancelAnimationFrame(rafId);
		};
	}, [updateIsStacked]);

	return (
		<figure
			ref={figureRef}
			className={clsx('c-block-het-archief-quote', { [STACKED_CLASS]: isStacked }, className)}
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
