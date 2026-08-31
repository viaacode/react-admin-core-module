import { useQuery } from '@tanstack/react-query';
import { findPeakFile, findPlayableFile } from '~shared/helpers/ie-object-files.ts';
import { isAudioFormat, isAudioVideoFormat } from '~shared/helpers/is-audio-video-format.ts';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { IeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

/** Only the sample array of a peak file is used; the rest of its metadata is not. */
interface PeakFile {
	data: number[];
}

export interface PlayableData {
	/** Ready to feed straight into a player, or null when the file could not be ticketed. */
	playableUrl: string | null;
	mimeType?: string;
	/** Audio only, and additive: without it the player still plays, it just draws no waveform. */
	peakfileData?: number[] | null;
}

const resolvePlayableData = async (ieObject: IeObject): Promise<PlayableData> => {
	const playableFile = findPlayableFile(ieObject);
	const peakFile = isAudioFormat(ieObject.dctermsFormat) ? findPeakFile(ieObject) : undefined;

	const [playableUrl, peakfileData] = await Promise.all([
		playableFile?.id
			? IeObjectsService.getPlayableUrl(playableFile.id, ieObject.schemaIdentifier)
			: null,
		peakFile?.id
			? IeObjectsService.getPlayableUrl(peakFile.id, ieObject.schemaIdentifier).then(
					async (peakFileUrl) => {
						if (!peakFileUrl) {
							return null;
						}
						const response = await fetch(peakFileUrl);
						return response.ok ? ((await response.json()) as PeakFile).data : null;
					}
				)
			: null,
	]);

	return { playableUrl, mimeType: playableFile?.mimeType, peakfileData };
};

/**
 * Tickets the media of every audio or video object handed in, keyed by pid.
 *
 * Resolved with the selection rather than when a tile is opened: the modal should play what is
 * already there instead of going to the network at the moment the visitor clicks. A ticket is
 * short-lived and access-checked at request time, so it cannot travel with the object itself and
 * has to be asked for separately -- but it can be asked for early.
 *
 * Objects that are not audio or video (a newspaper) are skipped: they have nothing to ticket here,
 * and the viewer resolves its own per-page tokens.
 */
export const useGetPlayableDataForIeObjects = (ieObjects: (IeObject | undefined)[]) => {
	const playableObjects = ieObjects.filter(
		(ieObject): ieObject is IeObject => !!ieObject && isAudioVideoFormat(ieObject.dctermsFormat)
	);

	return useQuery<Record<string, PlayableData>>({
		queryKey: [
			QUERY_KEYS.GET_IE_OBJECT_PLAYER_TICKET,
			playableObjects
				.map((ieObject) => ieObject.schemaIdentifier)
				.sort()
				.join(','),
		],
		queryFn: async () =>
			Object.fromEntries(
				await Promise.all(
					playableObjects.map(async (ieObject) => [
						ieObject.schemaIdentifier,
						await resolvePlayableData(ieObject),
					])
				)
			),
		enabled: playableObjects.length > 0,
		staleTime: 30 * 60 * 1000, // 30 minutes, same as the client's own ticket cache
	});
};
