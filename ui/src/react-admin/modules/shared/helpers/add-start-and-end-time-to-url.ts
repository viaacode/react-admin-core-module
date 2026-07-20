/**
 * Adds a media fragment (t=start,end) query param to a playable url, so the player only plays
 * that part of the video/audio. https://www.w3.org/TR/media-frags/
 * Does not use flowplayer cuepoints, since those only visually restrict the seekbar,
 * but still allow loading/playing the full video.
 * @param url the playable url returned by the player-ticket endpoint
 * @param startTime optional start time of the fragment in seconds
 * @param endTime optional end time of the fragment in seconds
 */
export function addStartAndEndTimeToUrl(
	url: string,
	startTime: string | undefined,
	endTime: string | undefined
): string {
	if (!url || (!startTime && !endTime)) {
		return url;
	}

	const separator = url.includes('?') ? '&' : '?';

	return `${url}${separator}t=${startTime || ''},${endTime || ''}`;
}
