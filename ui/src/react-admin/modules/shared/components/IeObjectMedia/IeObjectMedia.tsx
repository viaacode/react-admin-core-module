import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { IeObjectMediaInfo } from '~shared/components/IeObjectMedia/IeObjectMedia.types';
import { isAudioFormat, isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import type { DefaultComponentProps } from '~shared/types/components';

import './IeObjectMedia.scss';

export interface IeObjectMediaProps extends DefaultComponentProps {
	ieObject: IeObjectMediaInfo;
	// Shown as the image alt text when the object itself has no name
	fallbackTitle: string;
	// Identifies the player instance for the client that renders it (eg: analytics)
	locationId: string;
}

/**
 * Renders the media of an ie-object: the audio/video player for playable formats, the thumbnail
 * for everything else. Shared between the content blocks that show a single ie-object
 * (eg: the timeline block and the hero carousel).
 */
export const IeObjectMedia: FunctionComponent<IeObjectMediaProps> = ({
	className,
	ieObject,
	fallbackTitle,
	locationId,
}) => {
	const [isPaused, setIsPaused] = useState<boolean>(true);
	const { audioOrVideoPlayer: AudioOrVideoPlayer, defaultAudioStill } =
		AdminConfigManager.getConfig().components;

	// The player only needs the first representation that contains a file, same as the object detail page
	const representation = (ieObject.pages || [])
		.flatMap((page) => page?.representations || [])
		.find((rep) => !!rep?.files?.length);

	const isPlayable =
		!!AudioOrVideoPlayer &&
		!!representation &&
		!!ieObject.dctermsFormat &&
		isAudioVideoFormat(ieObject.dctermsFormat);

	// The thumbnail the proxy returns for audio is a signed link to an ugly speaker icon, so we
	// show the client's own waveform image instead. Same as the client does for its media cards.
	const thumbnailUrl =
		ieObject.dctermsFormat && isAudioFormat(ieObject.dctermsFormat)
			? defaultAudioStill
			: ieObject.thumbnailUrl;

	return (
		<div className={clsx('c-ie-object-media', className)}>
			{isPlayable && AudioOrVideoPlayer ? (
				<AudioOrVideoPlayer
					className="c-ie-object-media__player"
					locationId={locationId}
					representation={representation}
					dctermsFormat={ieObject.dctermsFormat}
					schemaIdentifier={ieObject.schemaIdentifier}
					maintainerLogo={ieObject.maintainerOverlay ? ieObject.maintainerLogo : undefined}
					cuePoints={undefined}
					poster={thumbnailUrl}
					paused={isPaused}
					onPlay={() => setIsPaused(false)}
					onPause={() => setIsPaused(true)}
					onEnded={() => setIsPaused(true)}
					onMediaReady={() => undefined}
				/>
			) : (
				thumbnailUrl && (
					<img
						src={thumbnailUrl}
						alt={ieObject.name || fallbackTitle}
						className="c-ie-object-media__image"
					/>
				)
			)}
		</div>
	);
};
