import {
	AudioWaveFormDisplay,
	type AudioWaveFormDisplayProps,
	AudioWaveFormDisplaySize,
} from '@meemoo/react-components';
import { Image } from '@viaa/avo2-components';
import type { FunctionComponent, ReactElement } from 'react';
import React from 'react';
import { AdminConfigManager } from '~core/config';
import { OptimizedImage } from '~shared/components/OptimizedImage/OptimizedImage';

export interface ImageOrAudioWaveFormProps extends Omit<AudioWaveFormDisplayProps, 'ariaLabel'> {
	imageSrc?: string;
	imageAlt: string;
	/** Width (css px) the image is shown at. Loads a resized version of the image when set. */
	imageDisplayWidth?: number;
}

export const ImageOrAudioWaveForm: FunctionComponent<ImageOrAudioWaveFormProps> = ({
	className,
	imageSrc,
	imageAlt,
	imageDisplayWidth,
	waveColor,
	backgroundColor,
	size = AudioWaveFormDisplaySize.Small,
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

	if (imageDisplayWidth) {
		return (
			<OptimizedImage
				src={imageSrc}
				displayWidth={imageDisplayWidth}
				alt={imageAlt}
				className={className}
				loading="lazy"
			/>
		);
	}

	return <Image src={imageSrc} alt={imageAlt} className={className} loading="lazy" />;
};
