import type { FunctionComponent } from 'react';
import React, { useState } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import { IeObjectType } from '~shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer.types';
import { BlockTimelineObjectMeta } from './BlockTimelineObjectMeta';
import type { TimelineIeObject } from './hooks/useGetTimelineIeObjects';

// Formats that the AudioOrVideoPlayer can play. Other formats (newspaper, image) fall back to the thumbnail.
const PLAYABLE_FORMATS: IeObjectType[] = [
	IeObjectType.VIDEO,
	IeObjectType.VIDEO_FRAGMENT,
	IeObjectType.AUDIO,
	IeObjectType.AUDIO_FRAGMENT,
	IeObjectType.FILM,
];

export const BlockTimelineObject: FunctionComponent<{
	ieObject: TimelineIeObject;
	fallbackTitle: string;
}> = ({ ieObject, fallbackTitle }) => {
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
		<div className="c-block-timeline__node-object">
			<div className="c-block-timeline__node-object-media">
				{isPlayable && AudioOrVideoPlayer ? (
					<AudioOrVideoPlayer
						className="c-block-timeline__node-object-player"
						locationId="block-timeline"
						representation={representation}
						dctermsFormat={ieObject.dctermsFormat}
						schemaIdentifier={ieObject.schemaIdentifier}
						maintainerLogo={ieObject.maintainerOverlay ? ieObject.maintainerLogo : undefined}
						cuePoints={undefined}
						poster={ieObject.thumbnailUrl}
						paused={isPaused}
						onPlay={() => setIsPaused(false)}
						onPause={() => setIsPaused(true)}
						onMediaReady={() => undefined}
					/>
				) : (
					ieObject.thumbnailUrl && (
						<img
							src={ieObject.thumbnailUrl}
							alt={ieObject.name || fallbackTitle}
							className="c-block-timeline__node-object-image"
						/>
					)
				)}
			</div>
		</div>
	);
};
