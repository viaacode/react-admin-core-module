import { useQuery } from '@tanstack/react-query';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { IeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Resolves whole ie-objects by pid through the general ie-objects endpoint, keyed by pid.
 *
 * Playable display data is cut to what a block renders, so a caller that needs the object itself --
 * the IIIF viewer needs its page list -- asks for it here instead.
 */
export const useGetIeObjectsByIds = (schemaIdentifiers: string[], enabled = true) => {
	const identifiers = schemaIdentifiers.filter(Boolean);

	return useQuery<Record<string, IeObject>>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_IDS, [...identifiers].sort().join(',')],
		queryFn: async () =>
			Object.fromEntries(
				(await IeObjectsService.getIeObjectsByIds(identifiers)).map((ieObject) => [
					ieObject.schemaIdentifier,
					ieObject,
				])
			),
		enabled: enabled && identifiers.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour, same as the playable display data
	});
};
