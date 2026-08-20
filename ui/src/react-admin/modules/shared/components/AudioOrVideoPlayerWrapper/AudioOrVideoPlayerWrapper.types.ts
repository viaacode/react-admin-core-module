import type {
	IeObjectFile,
	IeObjectRepresentation,
} from '~shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer.types.ts';
import type { CuePoints } from '~shared/components/FlowPlayerWrapper/FlowPlayerWrapper.types.ts';
import type { IeObjectType } from '~shared/helpers/map-format-to-type.ts';

/**Ò
 * Props for the audio/video player that the host application registers under
 * `AdminConfigManager.getConfig().components.audioOrVideoPlayer`.
 *
 * This is deliberately *not* the prop set of the client's own player component: the admin-core
 * only knows which ie-object and which part of it should play. Resolving that to a representation,
 * a playable file and a ticket is the registered component's job, since that logic (including the
 * v2 -> v3 pid conversion and the audio waveform peak files) lives in the client.
 *
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
export interface AudioOrVideoPlayerWrapperProps {
	className?: string;
	allowFullScreen?: boolean;
	paused: boolean;
	onPlay: () => void;
	onPause: () => void;
	onEnded?: () => void;
	onMediaReady: (isAvailable: boolean, playableFile: IeObjectFile | null) => void;
	onMediaDurationLoaded?: (duration: number) => void;
	dctermsFormat: IeObjectType | null;
	schemaIdentifier: string | undefined;
	representation: IeObjectRepresentation | null | undefined;
	maintainerLogo: string | null | undefined;
	cuePoints: CuePoints | undefined;
	locationId: string;
	poster: string | undefined;
	/**
	 * Start and end of the snippet to play, in seconds. When given, they are sent along to the
	 * player-ticket endpoint so the media service delivers only that part, rather than relying on
	 * flowplayer cuepoints, which merely restrict the seek bar.
	 *
	 * Pass both or neither: the media service only cuts when it has an end time.
	 * https://meemoo.atlassian.net/browse/ARC-3832
	 */
	startTime?: number;
	endTime?: number;
	title?: string;
	autoplay?: boolean;
}
