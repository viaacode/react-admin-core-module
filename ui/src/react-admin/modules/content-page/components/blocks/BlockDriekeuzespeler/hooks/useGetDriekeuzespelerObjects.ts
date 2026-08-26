import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~shared/types';
import {
	type DriekeuzespelerObject,
	getDriekeuzespelerObjects,
} from '../BlockDriekeuzespeler.service';

/**
 * Resolves the objects for the tiles currently on screen, keyed by schemaIdentifier.
 *
 * The ids are part of the query key, so a shuffle to three other interests fetches those and a
 * shuffle back to a selection already seen is served from the cache.
 */
export const useGetDriekeuzespelerObjects = (schemaIdentifiers: string[]) => {
	const identifiers = schemaIdentifiers.filter(Boolean);

	return useQuery<Record<string, DriekeuzespelerObject>>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_IDS, [...identifiers].sort().join(',')],
		queryFn: () => getDriekeuzespelerObjects(identifiers),
		enabled: identifiers.length > 0,
	});
};
