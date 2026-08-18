import {
	Button,
	FlowPlayer,
	type FlowPlayerProps,
	getValidStartAndEnd,
} from '@meemoo/react-components';
import { IconName, Image, Spinner } from '@viaa/avo2-components';
import clsx from 'clsx';
import { isNil } from 'es-toolkit';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { AdminConfigManager } from '~core/config';
import { Color } from '~modules/content-page/types/content-block.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import { Icon } from '~shared/components/Icon';
import {
	isAudioFormat,
	isAudioVideoFormat,
	isVideoFormat,
} from '~shared/helpers/is-audio-video-format.ts';
import { tText } from '~shared/helpers/translation-functions.ts';
import { useGetFileDuration } from '~shared/hooks/use-get-file-duration.ts';
import { HET_ARCHIEF } from '~shared/types';

export interface BlockHeroCarouselActiveSlideProps extends DefaultComponentProps {
	item?: HeroCarouselSlideItem;
	onEnded: () => void;
	isLoading?: boolean;
	isMuted: boolean;
	onMutedChange: (muted: boolean) => void;
}

export const BlockHeroCarouselActiveSlide: FunctionComponent<BlockHeroCarouselActiveSlideProps> = ({
	item,
	onEnded,
	isLoading,
	isMuted,
	onMutedChange,
}): ReactElement => {
	const { data: mediaDuration } = useGetFileDuration(item?.playableUrl);
	const [isPaused, setIsPaused] = useState(false);

	if (isLoading || !item?.schemaIdentifier) {
		return (
			<div className={clsx('c-block-hero-carousel__carousel-slide-placeholder')}>
				<Spinner size="large" locationId={'hero-carousel-slide'} />
			</div>
		);
	}

	const getStartAndEnd = () => {
		let cueStart: number | null = null;
		let cueEnd: number | null = null;

		// Only cuepoints if there are any set, and they do not fall outside the range of the video itself
		if (item.cuepoints) {
			if (
				item.cuepoints.start &&
				item.cuepoints.start > 0 &&
				(isNil(mediaDuration) || item.cuepoints.start < mediaDuration)
			) {
				cueStart = item.cuepoints.start;
			}

			if (
				item.cuepoints.end &&
				(isNil(mediaDuration) ||
					(item.cuepoints.end && item.cuepoints.end < mediaDuration && item.cuepoints.end > 0))
			) {
				cueEnd = item.cuepoints.end;
			}
		}

		return getValidStartAndEnd(cueStart, cueEnd, mediaDuration);
	};

	// The active slide is the only one big enough to warrant the full-size newspaper image, so
	// it's the only slide that prefers it over the (lower-res) thumbnail.
	const imageSrc = item.newspaperImage || item.videoThumbnail || item.thumbnailUrl || '';

	const [start, end]: [number | null, number | null] = getStartAndEnd();
	const shared: Partial<FlowPlayerProps> = {
		poster: imageSrc,
		title: item.name,
		logo: item.maintainerLogo ?? undefined,
		autoplay: true,
		muted: isMuted,
		onMutedChange,
		onEnded: onEnded,
		onError: onEnded,
		token: AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_TOKEN,
		dataPlayerId: AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_ID,
		ui: isAudioVideoFormat(item.dctermsFormat) ? undefined : 1, // 1 = NO_FULLSCREEN
		plugins: ['subtitles', 'cuepoints', 'audio'],
		peakColorBackground: Color.Gray800,
		peakColorInactive: Color.Zinc,
		peakColorActive: Color.SeaGreen,
		peakHeightFactor: 0.6,
		preload: 'metadata',
		start,
		end,
	};

	if (isAudioFormat(item.dctermsFormat)) {
		return (
			<FlowPlayer
				type="audio"
				src={[
					{
						src: item.playableUrl as string,
						type: item.mimeType as string,
					},
				]}
				waveformData={item.peakfileData?.data || undefined}
				{...shared}
			/>
		);
	}

	if (isVideoFormat(item.dctermsFormat)) {
		return <FlowPlayer type="video" src={item.playableUrl as string} {...shared} />;
	}

	if (!imageSrc) {
		return <div className={clsx('c-block-hero-carousel__carousel-slide-image')} />;
	}

	return (
		<div
			className={clsx(
				'c-block-hero-carousel__carousel-slide-image',
				'c-block-hero-carousel__carousel-slide-image--animated',
				isPaused && 'c-block-hero-carousel__carousel-slide-image--paused'
			)}
		>
			<Image
				src={imageSrc}
				alt={item.name}
				className="c-block-hero-carousel__carousel-slide-image-media"
			/>
			<div className="c-block-hero-carousel__carousel-slide-image-controls">
				<Button
					variants={['black', 'sm']}
					icon={<Icon name={isPaused ? IconName.play : IconName.pause} />}
					title={
						isPaused
							? tText('Afspelen', undefined, [HET_ARCHIEF])
							: tText('Pauzeren', undefined, [HET_ARCHIEF])
					}
					ariaLabel={
						isPaused
							? tText('Afspelen', undefined, [HET_ARCHIEF])
							: tText('Pauzeren', undefined, [HET_ARCHIEF])
					}
					onClick={() => setIsPaused((paused) => !paused)}
				/>
				<div className="c-block-hero-carousel__carousel-slide-image-progress" aria-hidden="true">
					<div className="c-block-hero-carousel__carousel-slide-image-progress-track">
						<div
							className="c-block-hero-carousel__carousel-slide-image-progress-fill"
							onAnimationEnd={onEnded}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
