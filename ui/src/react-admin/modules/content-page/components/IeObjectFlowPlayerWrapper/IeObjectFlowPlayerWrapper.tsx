import { FlowPlayer, type FlowPlayerProps } from '@meemoo/react-components';
import type { HetArchiefPlayableDisplayIeObject } from '@viaa/avo2-types';
import React, { type FunctionComponent, type ReactNode } from 'react';
import { AdminConfigManager } from '~core/config';
import { Color } from '~modules/content-page/types/content-block.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import {
	isAudioFormat,
	isAudioVideoFormat,
	isVideoFormat,
} from '~shared/helpers/is-audio-video-format.ts';

export interface IeObjectFlowPlayerWrapperProps extends DefaultComponentProps {
	ieObject: HetArchiefPlayableDisplayIeObject;
	/** Overrides the object name as the player's accessible title, e.g. a title set by an editor */
	title?: string;
	autoplay?: boolean;
	poster?: string;
	onEnded?: () => void;
	isMuted?: boolean;
	onMutedChange?: (muted: boolean) => void;
}

export const IeObjectFlowPlayerWrapper: FunctionComponent<IeObjectFlowPlayerWrapperProps> = ({
	ieObject,
	title,
	autoplay,
	poster,
	onEnded,
	isMuted,
	onMutedChange,
	className,
}): ReactNode => {
	if (!isAudioVideoFormat(ieObject.dctermsFormat)) {
		return null;
	}

	// FlowPlayer calls onPlay once per player, for autoplay and manual play alike, so this reports
	// every play of this object without needing a guard of its own. What to do with it is up to the
	// consuming app: the admin-core does no analytics.
	const handlePlay = () => {
		AdminConfigManager.getConfig().handlers?.onIeObjectPlay?.({
			schemaIdentifier: ieObject.schemaIdentifier,
			maintainerId: ieObject.maintainerId,
			dctermsFormat: ieObject.dctermsFormat,
			// snipPoint is what the proxy actually cut the url at, echoed back for both a saved
			// block and one still being edited, and it only ever holds a real interval - so having
			// both times is exactly "an editor configured a snippet for this block".
			isBlockSnippet:
				ieObject.snipPoint?.start !== undefined && ieObject.snipPoint?.end !== undefined,
		});
	};

	// The active slide is the only one big enough to warrant the full-size newspaper image, so
	// it's the only slide that prefers it over the (lower-res) thumbnail.
	const imageSrc = ieObject.thumbnailUrl || '';

	const shared: Partial<FlowPlayerProps> = {
		poster: poster ?? imageSrc,
		title: title || ieObject.name,
		logo: ieObject.maintainerLogo ?? undefined,
		autoplay,
		muted: isMuted,
		onMutedChange,
		onPlay: handlePlay,
		onEnded: onEnded,
		onError: onEnded,
		token: AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_TOKEN,
		dataPlayerId: AdminConfigManager.getConfig().flowplayer.FLOW_PLAYER_ID,
		ui: isVideoFormat(ieObject.dctermsFormat) ? undefined : 1, // 1 = NO_FULLSCREEN
		plugins: ['subtitles', 'audio'],
		peakColorBackground: Color.Gray800,
		peakColorInactive: Color.Zinc,
		peakColorActive: Color.SeaGreen,
		peakHeightFactor: 0.6,
		preload: 'metadata',
		className,
		// Not passing start and end times, since they are already in the snippet video url: browse.mp4?t=x,y&token=token-containing-x-y
	};

	if (isAudioFormat(ieObject.dctermsFormat)) {
		return (
			<FlowPlayer
				type="audio"
				src={[
					{
						src: ieObject.playableUrl as string,
						type: ieObject.mimeType as string,
					},
				]}
				waveformData={ieObject.peakfileData || undefined}
				{...shared}
			/>
		);
	}

	return <FlowPlayer type="video" src={ieObject.playableUrl as string} {...shared} />;
};
