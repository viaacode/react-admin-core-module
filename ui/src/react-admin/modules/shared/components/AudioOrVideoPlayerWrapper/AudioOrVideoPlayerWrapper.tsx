import type { FC } from 'react';
import { useMemo } from 'react';
import { AdminConfigManager } from '~core/config/config.class';
import type { AudioOrVideoPlayerWrapperProps } from '~shared/components/AudioOrVideoPlayerWrapper/AudioOrVideoPlayerWrapper.types';

/**
 * Renders the audio/video player the host application registered in its admin-core config.
 * Mirrors FlowPlayerWrapper: the admin-core cannot depend on the client package, so the client
 * hands us the component instead.
 */
export const AudioOrVideoPlayerWrapper: FC<AudioOrVideoPlayerWrapperProps> = (props) => {
	const config = AdminConfigManager.getConfig().components;
	const Renderer = useMemo(
		() => config?.audioOrVideoPlayer || (() => <>No audio or video player configured.</>),
		[config]
	);

	return <Renderer {...props} />;
};
