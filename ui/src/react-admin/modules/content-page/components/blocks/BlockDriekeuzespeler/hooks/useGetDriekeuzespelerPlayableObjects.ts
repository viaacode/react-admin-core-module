import { useQuery } from '@tanstack/react-query';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type {
	PlayableDisplayIeObject,
	UnsavedPlayableDisplayDataObject,
} from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

/**
 * Proactively resolves the objects behind the tiles currently on screen -- thumbnail, name and
 * everything the modal needs to play one, keyed by schemaIdentifier -- in a single request instead
 * of one per tile click.
 *
 * The ids are part of the query key, so a shuffle to three other interests fetches those and a
 * shuffle back to a selection already seen is served from the cache -- including whichever tile
 * has since been opened in the modal.
 *
 * A block being edited has no id yet, so it passes its objects instead, exactly as the timeline and
 * carousel blocks do. The proxy honours those only for users who may edit content pages.
 */
export const useGetDriekeuzespelerPlayableObjects = (
	blockId: string | undefined,
	schemaIdentifiers: string[],
	unsavedObjects?: UnsavedPlayableDisplayDataObject[]
) => {
	const identifiers = schemaIdentifiers.filter(Boolean);
	const objects = blockId ? undefined : unsavedObjects;

	return useQuery<Record<string, PlayableDisplayIeObject>>({
		queryKey: [
			QUERY_KEYS.GET_IE_OBJECTS_PLAYABLE_DISPLAY_DATA,
			blockId,
			[...identifiers].sort().join(','),
			objects && JSON.stringify(objects),
		],
		queryFn: async () => {
			const entries = await IeObjectsService.getPlayableDisplayData(
				blockId,
				objects,
				identifiers
			);

			return Object.fromEntries(
				(entries || [])
					.filter((entry): entry is PlayableDisplayIeObject => !!entry)
					.map((entry) => [entry.schemaIdentifier, entry])
			);
		},
		enabled: identifiers.length > 0 && (!!blockId || !!objects?.length),
		staleTime: 60 * 60 * 1000, // 1 hour, same as the other playable data
	});
};
