/**
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
	/** Pid / fragmentId of the ie-object to play. */
	schemaIdentifier: string;
	/** Start of the snippet to play, in seconds. Always set together with `endTime`. */
	startTime?: number;
	/** End of the snippet to play, in seconds. Always set together with `startTime`. */
	endTime?: number;
	/** Thumbnail to show before playback starts. Falls back to the object's own thumbnail. */
	poster?: string;
	/** Accessibility title for the player. */
	title?: string;
	autoplay?: boolean;
	className?: string;
}
