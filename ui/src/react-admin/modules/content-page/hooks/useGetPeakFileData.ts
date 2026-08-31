import { useQuery } from '@tanstack/react-query';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import { QUERY_KEYS } from '~shared/types';

/** Only the sample array is used; the rest of the peak file's metadata is not. */
interface PeakFile {
	data: number[];
}

/**
 * The waveform samples behind an audio object, for the overlay on its player.
 *
 * The peak file is a file of the object like any other, so it has to be ticketed first and then
 * fetched. Purely additive: without it the player still plays, it just draws no waveform.
 */
export const useGetPeakFileData = (
	fileId: string | undefined,
	schemaIdentifier: string | undefined,
	enabled = true
) =>
	useQuery<number[] | null>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECT_PEAK_FILE, schemaIdentifier, fileId],
		queryFn: async () => {
			const peakFileUrl = await IeObjectsService.getPlayableUrl(
				fileId as string,
				schemaIdentifier as string
			);
			if (!peakFileUrl) {
				return null;
			}

			const response = await fetch(peakFileUrl);
			return response.ok ? ((await response.json()) as PeakFile).data : null;
		},
		enabled: enabled && !!fileId && !!schemaIdentifier,
		staleTime: 30 * 60 * 1000,
	});
