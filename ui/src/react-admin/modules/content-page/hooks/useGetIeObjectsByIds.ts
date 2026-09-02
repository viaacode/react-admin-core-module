import { useQuery } from '@tanstack/react-query';
import type { HetArchiefIeObject as IeObject } from '@viaa/avo2-types';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Whole ie-objects by pid. Playable display data is cut to what a block renders, so a caller needing
 * the object itself -- the IIIF viewer needs its page list -- asks here instead.
 */
export const useGetIeObjectsByIds = (schemaIdentifiers: string[], enabled = true) => {
	const identifiers = schemaIdentifiers.filter(Boolean);

	return useQuery<Record<string, IeObject>>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_IDS, [...identifiers].sort().join(',')],
		queryFn: async () =>
			Object.fromEntries(
				// A pid the endpoint could not resolve comes back as null, so entries cannot be keyed blindly.
				(await IeObjectsService.getIeObjectsByIds(identifiers))
					.filter((ieObject): ieObject is IeObject => !!ieObject?.schemaIdentifier)
					.map((ieObject) => [ieObject.schemaIdentifier, ieObject])
			),
		enabled: enabled && identifiers.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour, same as the playable display data
	});
};
