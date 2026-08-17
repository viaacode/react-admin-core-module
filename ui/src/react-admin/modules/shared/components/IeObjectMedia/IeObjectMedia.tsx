import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { IeObjectMediaInfo } from '~shared/components/IeObjectMedia/IeObjectMedia.types';
import { IeObjectType } from '~shared/helpers/mapFormatToType.ts';
import type { DefaultComponentProps } from '~shared/types/components';

import './IeObjectMedia.scss';

// Formats that the AudioOrVideoPlayer can play. Other formats (newspaper, image) fall back to the thumbnail.
const PLAYABLE_FORMATS: IeObjectType[] = [
	IeObjectType.video,
	IeObjectType.videofragment,
	IeObjectType.audio,
	IeObjectType.audiofragment,
	IeObjectType.film,
];

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
	const AudioOrVideoPlayer = AdminConfigManager.getConfig().components?.audioOrVideoPlayer;

	// The player only needs the first representation that contains a file, same as the object detail page
	const representation = (ieObject.pages || [])
		.flatMap((page) => page?.representations || [])
		.find((rep) => !!rep?.files?.length);

	const isPlayable =
		!!AudioOrVideoPlayer &&
		!!representation &&
		!!ieObject.dctermsFormat &&
		PLAYABLE_FORMATS.includes(ieObject.dctermsFormat);

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
					poster={ieObject.thumbnailUrl}
					paused={isPaused}
					onPlay={() => setIsPaused(false)}
					onPause={() => setIsPaused(true)}
					onEnded={() => setIsPaused(true)}
					onMediaReady={() => undefined}
				/>
			) : (
				ieObject.thumbnailUrl && (
					<img
						src={ieObject.thumbnailUrl}
						alt={ieObject.name || fallbackTitle}
						className="c-ie-object-media__image"
					/>
				)
			)}
		</div>
	);
};
