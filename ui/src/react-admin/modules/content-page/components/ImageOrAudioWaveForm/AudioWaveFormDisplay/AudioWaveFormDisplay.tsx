import clsx from 'clsx';
import type { CSSProperties, FunctionComponent, ReactElement } from 'react';
import React from 'react';
import { Color } from '~modules/content-page/types/content-block.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import {
	type AudioWaveFormDisplaySize,
	getWaveFormBars,
	getWaveFormViewBox,
	WAVE_FORM_STROKE_WIDTH,
} from './AudioWaveFormDisplay.helpers';

import './AudioWaveFormDisplay.scss';

export type { AudioWaveFormDisplaySize };

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
	const bars = getWaveFormBars(size);
	const viewBox = getWaveFormViewBox(size);

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
			{/* Plain box for consumers to hook a hover-zoom transform onto: transitioning `transform`
			on an <svg> itself doesn't animate smoothly in every browser, unlike an ordinary element. */}
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
							y1={bar.y1}
							y2={bar.y2}
							strokeWidth={WAVE_FORM_STROKE_WIDTH}
							strokeLinecap="round"
						/>
					))}
				</svg>
			</div>
		</div>
	);
};
