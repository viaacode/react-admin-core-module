import { useQuery } from '@tanstack/react-query';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Fetches the playable display data for every ie-object referenced by a content block.
 *
 * Only the block id is sent: the proxy reads the objects and their snippet start/end times from
 * the stored block config, so a client can't ask for a cut of an object that no editor
 * configured. The result keeps the block's own element order -- entry i belongs to element i --
 * with null for elements that have no ie-object (yet), so callers can merge it with their own
 * per-element state by index.
 *
 * A block that hasn't been saved yet has no id, so there is nothing to fetch for it: the query
 * stays disabled and the block renders from its editor state alone.
 */
export const useGetIeObjectsPlayableDisplayData = (blockId: string | undefined) => {
	return useQuery<(PlayableDisplayIeObject | null)[]>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_PLAYABLE_DISPLAY_DATA, blockId],
		queryFn: async () => (await IeObjectsService.getPlayableDisplayData(blockId as string)) ?? [],
		enabled: !!blockId,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
