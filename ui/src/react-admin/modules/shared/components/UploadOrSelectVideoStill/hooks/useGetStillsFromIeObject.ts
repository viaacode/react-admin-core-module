import { useQuery } from '@tanstack/react-query';
import { compact } from 'es-toolkit';
import { stringifyUrl } from 'query-string';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import {
	getAdminCoreApiUrl,
	getProxyUrl,
} from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

/** Only the parts of the ie-object detail response that we need to locate a playable video file. */
interface IeObjectForStills {
	thumbnailUrl?: string | null;
	pages?: {
		representations?: {
			thumbnailUrl?: string | null;
			files?: { id: string; mimeType: string }[];
		}[];
	}[];
}

interface StillInfo {
	previewImagePath?: string | null;
	thumbnailImagePath?: string | null;
}

/**
 * Fetches the stills an admin can pick from for an AV ie-object.
 *
 * Two sources, in the order they are offered:
 *  1. A keyframe taken from the snippet itself, via `POST /admin/video-stills`. That endpoint wants
 *     the id of the *file* (not the object) and a start time in milliseconds.
 *  2. The object's own thumbnail, as a fallback. Needed because the keyframe lookup returns nothing
 *     for a snippet starting at 00:00:00, and resolves to a generic waveform image for audio.
 *
 * Note this only runs while the admin configures the block: the video-stills route is behind a
 * logged-in guard, so the chosen url is stored in the block state rather than resolved at render.
 *
 * https://meemoo.atlassian.net/browse/ARC-3832
 */
export const useGetStillsFromIeObject = (
	schemaIdentifier: string | null,
	/** Start of the snippet in seconds, as stored on the block. */
	startTimeSeconds: number | null,
	options: { enabled?: boolean } = {}
) => {
	return useQuery<string[]>({
		queryKey: [QUERY_KEYS.GET_VIDEO_STILLS_FOR_IE_OBJECT, schemaIdentifier, startTimeSeconds],
		queryFn: async (): Promise<string[]> => {
			if (!schemaIdentifier) {
				return [];
			}

			const ieObjects: IeObjectForStills[] = await fetchWithLogoutJson(
				stringifyUrl({
					url: `${getProxyUrl()}/ie-objects`,
					query: { schemaIdentifiers: [schemaIdentifier], resolveThumbnailUrl: 'true' },
				})
			);
			const ieObject = ieObjects?.[0];

			if (!ieObject) {
				return [];
			}

			const representations = (ieObject.pages || []).flatMap((page) => page.representations || []);
			const objectThumbnails = compact([
				ieObject.thumbnailUrl,
				...representations.map((representation) => representation.thumbnailUrl),
			]);

			// The video-stills route needs a start time; without one it has no keyframe to look for.
			if (!startTimeSeconds) {
				return objectThumbnails;
			}

			const videoFile = representations
				.flatMap((representation) => representation.files || [])
				.find((file) => file.mimeType?.startsWith('video/'));

			if (!videoFile) {
				return objectThumbnails;
			}

			const stills: (StillInfo | null)[] = await fetchWithLogoutJson(
				`${getAdminCoreApiUrl()}/admin/video-stills`,
				{
					method: 'POST',
					body: JSON.stringify({
						requests: [{ fileId: videoFile.id, startTime: startTimeSeconds * 1000 }],
					}),
				}
			);

			return [
				...compact(
					(stills || []).map((still) => still?.previewImagePath || still?.thumbnailImagePath)
				),
				...objectThumbnails,
			];
		},
		enabled: true,
		...options,
	});
};
