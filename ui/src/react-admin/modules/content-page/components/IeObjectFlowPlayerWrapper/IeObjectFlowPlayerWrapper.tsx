import { FlowPlayer, type FlowPlayerProps, getValidStartAndEnd } from '@meemoo/react-components';
import { isNil } from 'es-toolkit';
import React, { type FunctionComponent, type ReactNode } from 'react';
import { AdminConfigManager } from '~core/config';
import { Color } from '~modules/content-page/types/content-block.types.ts';
import type { DefaultComponentProps } from '~modules/shared/types/components';
import {
	isAudioFormat,
	isAudioVideoFormat,
	isVideoFormat,
} from '~shared/helpers/is-audio-video-format.ts';
import { useGetFileDuration } from '~shared/hooks/use-get-file-duration.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

export interface IeObjectFlowPlayerWrapperProps extends DefaultComponentProps {
	ieObject: PlayableDisplayIeObject;
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
