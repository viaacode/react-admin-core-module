import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React from 'react';
import type { DefaultComponentProps } from '~modules/shared/types/components';

import './AudioWaveFormDisplay.scss';
import { Color } from '~modules/content-page/types/content-block.types.ts';

export type AudioWaveFormDisplaySize = 'small' | 'large';

// Geometry traced from the reference asset (Frame 1895.svg): 30 vertical bars, evenly spaced 3
// units apart starting at x=0.9, each centered on y=21.6 in a 92x44 viewBox.
const WAVE_FORM_VIEW_BOX_WIDTH = 92;
const WAVE_FORM_VIEW_BOX_HEIGHT = 44;
const WAVE_FORM_CENTER_Y = 21.6;
const WAVE_FORM_FIRST_BAR_X = 0.9;
const WAVE_FORM_BAR_SPACING = 3;
const WAVE_FORM_STROKE_WIDTH = 1.8;

// Breathing room around the bars, as a fraction of the display's own box on each side -- baked
// into the viewBox (rather than CSS padding on a percentage-sized box) so it can never collapse
// to zero on an unusually short/narrow container, and `preserveAspectRatio="xMidYMid meet"` below
// keeps the wave form's own proportions intact -- scaled and centered, never stretched -- no
// matter what box it ends up in.
const WAVE_FORM_PADDING_X_RATIO = 0.15;
const WAVE_FORM_PADDING_Y_RATIO = 0.3;

// Half the height of each bar (in viewBox units), left to right, traced from Frame 1895.svg.
const WAVE_FORM_BAR_HALF_HEIGHTS: readonly number[] = [
	0.3, 3.3, 3.3, 6.9, 3.3, 6.9, 13.5, 20.7, 10.5, 6.9, 17.1, 13.5, 10.5, 3.3, 6.9, 3.3, 3.3, 6.9,
	10.5, 13.5, 6.9, 3.3, 3.3, 6.9, 3.3, 3.3, 6.9, 3.3, 3.3, 1.5,
];

interface WaveFormBar {
	x: number;
	halfHeight: number;
}

const WAVE_FORM_BAR_COUNT = WAVE_FORM_BAR_HALF_HEIGHTS.length;

// Same right margin the reference asset leaves after its last bar, used to size the large
// viewBox so its trailing edge keeps that same margin too.
const WAVE_FORM_RIGHT_MARGIN =
	WAVE_FORM_VIEW_BOX_WIDTH -
	(WAVE_FORM_FIRST_BAR_X + (WAVE_FORM_BAR_COUNT - 1) * WAVE_FORM_BAR_SPACING);

function buildWaveFormBars(
	barCount: number,
	halfHeightAt: (index: number) => number
): WaveFormBar[] {
	return Array.from({ length: barCount }, (_, index) => ({
		x: WAVE_FORM_FIRST_BAR_X + index * WAVE_FORM_BAR_SPACING,
		halfHeight: halfHeightAt(index),
	}));
}

function getWaveFormViewBoxWidth(barCount: number): number {
	return WAVE_FORM_FIRST_BAR_X + (barCount - 1) * WAVE_FORM_BAR_SPACING + WAVE_FORM_RIGHT_MARGIN;
}

// Pads the bars' own bounding box out to the full display box, by the ratios above, expressed as
// an SVG viewBox (min-x, min-y, width, height) rather than CSS padding.
function getWaveFormViewBox(contentWidth: number, contentHeight: number): string {
	const width = contentWidth / (1 - 2 * WAVE_FORM_PADDING_X_RATIO);
	const height = contentHeight / (1 - 2 * WAVE_FORM_PADDING_Y_RATIO);
	const minX = -(width - contentWidth) / 2;
	const minY = -(height - contentHeight) / 2;
	return `${minX} ${minY} ${width} ${height}`;
}

const SMALL_WAVE_FORM_BARS: readonly WaveFormBar[] = buildWaveFormBars(
	WAVE_FORM_BAR_COUNT,
	(index) => WAVE_FORM_BAR_HALF_HEIGHTS[index]
);

// Large: the small wave form immediately followed by its own mirror image, spaced along the same
// evenly-spaced grid as every other bar -- not by placing two independent small viewBoxes side by
// side, which would double up their outer margins into an oversized gap in the middle.
const LARGE_WAVE_FORM_BARS: readonly WaveFormBar[] = buildWaveFormBars(
	WAVE_FORM_BAR_COUNT * 2,
	(index) =>
		WAVE_FORM_BAR_HALF_HEIGHTS[
			index < WAVE_FORM_BAR_COUNT ? index : WAVE_FORM_BAR_COUNT * 2 - 1 - index
		]
);

export interface AudioWaveFormDisplayProps extends DefaultComponentProps {
	waveColor?: Color;
	backgroundColor?: Color;
	size?: AudioWaveFormDisplaySize;
	ariaLabel?: string;
}

export const AudioWaveFormDisplay: FunctionComponent<AudioWaveFormDisplayProps> = ({
	className,
	ariaLabel,
	waveColor = Color.White,
	backgroundColor,
	size = 'small',
}): ReactElement => {
	const bars = size === 'large' ? LARGE_WAVE_FORM_BARS : SMALL_WAVE_FORM_BARS;
	const viewBox = getWaveFormViewBox(
		getWaveFormViewBoxWidth(bars.length),
		WAVE_FORM_VIEW_BOX_HEIGHT
	);

	return (
		<div
			role="img"
			aria-label={ariaLabel}
			className={clsx('c-audio-wave-form-display', `c-audio-wave-form-display--${size}`, className)}
			style={
				{
					'--c-audio-wave-form-display-bg': backgroundColor,
					'--c-audio-wave-form-display-wave-color': waveColor,
				} as CSSProperties
			}
		>
			{/* A plain box around the svg, rather than putting the class consumers hook a hover-zoom
			transform onto directly on the svg: CSS transitions on an <svg> element's own `transform`
			don't animate smoothly in every browser (the scale snaps instead of tweening), where a
			transform on an ordinary HTML element -- exactly what an <img> is -- always does. */}
			<div className="c-audio-wave-form-display__scaler">
				<svg
					className="c-audio-wave-form-display__svg"
					viewBox={viewBox}
					preserveAspectRatio="xMidYMid meet"
					aria-hidden="true"
				>
					{bars.map((bar, index) => (
						<line
							// biome-ignore lint/suspicious/noArrayIndexKey: decorative, no identity of its own
							key={index}
							className="c-audio-wave-form-display__bar"
							x1={bar.x}
							x2={bar.x}
							y1={WAVE_FORM_CENTER_Y - bar.halfHeight}
							y2={WAVE_FORM_CENTER_Y + bar.halfHeight}
							strokeWidth={WAVE_FORM_STROKE_WIDTH}
							strokeLinecap="round"
						/>
					))}
				</svg>
			</div>
		</div>
	);
};
