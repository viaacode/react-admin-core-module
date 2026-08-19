import { useQuery } from '@tanstack/react-query';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

// Multiple slides can point at the same schemaIdentifier with different snipPoints (e.g. two
// clips from the same video), so schemaIdentifier alone isn't a unique key -- fold the snipPoint
// into the key used to match a fetched object back to the slide that requested it.
const toObjectKey = (schemaIdentifier: string, start?: number, end?: number): string =>
	`${schemaIdentifier}__${start ?? ''}__${end ?? ''}`;

export const useGetPlayableDisplayData = (mediaItems: HeroCarouselSlideItem[]) => {
	// Slots with no media item selected yet (e.g. a freshly added, not-yet-filled-in editor row)
	// have an empty schemaIdentifier -- exclude them from the request, there's nothing to fetch.
	const requestableMediaItems = mediaItems.filter((item) => !!item.schemaIdentifier);
	const schemaIdentifiers = requestableMediaItems.map(({ schemaIdentifier }) => schemaIdentifier);

	return useQuery<PlayableDisplayIeObject[]>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_PLAYABLE_DISPLAY_DATA, schemaIdentifiers.join(',')],
		placeholderData: mediaItems,
		queryFn: async () => {
			const objects = await IeObjectsService.getPlayableDisplayData(
				requestableMediaItems.map((item) => ({
					schemaIdentifier: item.schemaIdentifier,
					start: item.snipPoint?.start,
					end: item.snipPoint?.end,
				}))
			);

			// Look fetched objects up by key rather than zipping arrays by index: this keeps every
			// slide -- including empty slots that were never requested -- in its original position,
			// and tolerates a response that's missing an entry, null, or out of order for any id.
			const objectByKey = new Map(
				(objects ?? [])
					.filter((object): object is PlayableDisplayIeObject => !!object?.schemaIdentifier)
					.map((object) => [
						toObjectKey(object.schemaIdentifier, object.snipPoint?.start, object.snipPoint?.end),
						object,
					])
			);

			return mediaItems.map(
				(placeholder) =>
					({
						...placeholder,
						...objectByKey.get(
							toObjectKey(
								placeholder.schemaIdentifier,
								placeholder.snipPoint?.start,
								placeholder.snipPoint?.end
							)
						),
					}) as PlayableDisplayIeObject
			);
		},
		enabled: schemaIdentifiers.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
