import { useQuery } from '@tanstack/react-query';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type {
	PlayableDisplayIeObject,
	UnsavedPlayableDisplayDataObject,
} from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Resolves the one object the visitor opened: the signed play url, the maintainer logo, and for a
 * newspaper the IIIF detail image.
 *
 * Only ever asks for a single object. The block can hold 200 interests, and the playable route
 * otherwise resolves every object a block references -- signed urls, audio waveforms and base64
 * newspaper images included. The proxy still checks the object is one this block references.
 *
 * A block being edited has no id yet, so it passes its objects instead, exactly as the timeline and
 * carousel blocks do. The proxy honours those only for users who may edit content pages.
 */
export const useGetDriekeuzespelerPlayableObject = (
	blockId: string | undefined,
	schemaIdentifier: string | undefined,
	unsavedObjects?: UnsavedPlayableDisplayDataObject[]
) => {
	const objects = blockId ? undefined : unsavedObjects;

	return useQuery<PlayableDisplayIeObject | null>({
		queryKey: [
			QUERY_KEYS.GET_IE_OBJECTS_PLAYABLE_DISPLAY_DATA,
			blockId,
			schemaIdentifier,
			objects && JSON.stringify(objects),
		],
		queryFn: async () => {
			const entries = await IeObjectsService.getPlayableDisplayData(
				blockId,
				objects,
				schemaIdentifier
			);

			// A saved block narrows to one entry. An unsaved block cannot narrow server side, since the
			// objects travel in the request, so pick the matching entry here.
			const resolved = entries || [];

			return (
				resolved.find((entry) => entry?.schemaIdentifier === schemaIdentifier) ??
				resolved[0] ??
				null
			);
		},
		// Nothing to resolve until a tile has been opened.
		enabled: !!schemaIdentifier && (!!blockId || !!objects?.length),
		staleTime: 60 * 60 * 1000, // 1 hour, same as the other playable data
	});
};
