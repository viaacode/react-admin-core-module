import { Image } from '@viaa/avo2-components';
import type { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config';
import {
	AudioWaveFormDisplay,
	type AudioWaveFormDisplayProps,
} from './AudioWaveFormDisplay/AudioWaveFormDisplay.tsx';

export interface ImageOrAudioWaveFormProps extends Omit<AudioWaveFormDisplayProps, 'ariaLabel'> {
	imageSrc?: string;
	imageAlt: string;
}

export const ImageOrAudioWaveForm: FunctionComponent<ImageOrAudioWaveFormProps> = ({
	className,
	imageSrc,
	imageAlt,
	waveColor,
	backgroundColor,
	size = 'small',
}): ReactElement => {
	if (!imageSrc) {
		return <></>;
	}

	const isAudioStill = imageSrc === AdminConfigManager.getConfig().components.defaultAudioStill;

	if (isAudioStill) {
		return (
			<AudioWaveFormDisplay
				className={className}
				waveColor={waveColor}
				backgroundColor={backgroundColor}
				size={size}
				ariaLabel={imageAlt}
			/>
		);
	}

	return <Image src={imageSrc} alt={imageAlt} className={className} loading="lazy" />;
};
