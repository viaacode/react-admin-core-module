import { useQuery } from '@tanstack/react-query';
import type {
	HetArchiefPlayableDisplayIeObject,
	HetArchiefUnsavedPlayableDisplayDataObject,
} from '@viaa/avo2-types';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Fetches the playable display data for every ie-object referenced by a content block.
 *
 * Normally only the block id is sent: the proxy reads the objects and their snippet start/end
 * times from the stored block config, so a client can't ask for a cut of an object that no editor
 * configured. The result keeps the block's own element order -- entry i belongs to element i --
 * with null for elements that have no ie-object (yet), so callers can merge it with their own
 * per-element state by index.
 *
 * Inside the content page editor the block config is being changed as we speak -- and a freshly
 * added block has no id at all -- so resolving from the saved config would show a preview that is
 * one step behind, or none at all until the page is saved. Blocks rendered there get no blockId
 * and pass their objects (with snipPoints) as `unsavedObjects` instead, which the proxy only
 * honours for users who may edit content pages. Keep one entry per element there as well, so the
 * response stays aligned.
 *
 * The two are mutually exclusive on the endpoint, which is what the blockId check below enforces:
 * a block either has an id to look up, or sends what it is rendering, never both.
 */
export const useGetIeObjectsPlayableDisplayData = (
	blockId: string | undefined,
	unsavedObjects?: HetArchiefUnsavedPlayableDisplayDataObject[]
) => {
	const objects = blockId ? undefined : unsavedObjects;

	return useQuery<(HetArchiefPlayableDisplayIeObject | null)[]>({
		queryKey: [
			QUERY_KEYS.GET_IE_OBJECTS_PLAYABLE_DISPLAY_DATA,
			blockId,
			objects && JSON.stringify(objects),
		],
		queryFn: async () => (await IeObjectsService.getPlayableDisplayData(blockId, objects)) ?? [],
		enabled: !!blockId || !!objects?.length,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
