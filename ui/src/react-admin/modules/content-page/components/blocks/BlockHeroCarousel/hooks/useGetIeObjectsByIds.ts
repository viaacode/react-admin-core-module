import { useQuery } from '@tanstack/react-query';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

export const useGetIeObjectsByIds = (mediaItems: HeroCarouselSlideItem[]) => {
	// Slots with no media item selected yet (e.g. a freshly added, not-yet-filled-in editor row)
	// have an empty schemaIdentifier -- exclude them from the request, there's nothing to fetch.
	const requestableMediaItems = mediaItems.filter((item) => !!item.schemaIdentifier);
	const schemaIdentifiers = requestableMediaItems.map(({ schemaIdentifier }) => schemaIdentifier);

	return useQuery<PlayableDisplayIeObject[]>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_ID, schemaIdentifiers.join(',')],
		placeholderData: mediaItems,
		queryFn: async () => {
			const objects = await IeObjectsService.getPlayableDisplayData(
				requestableMediaItems.map((item) => ({
					schemaIdentifier: item.schemaIdentifier,
					start: item.cuepoints?.start,
					end: item.cuepoints?.end,
				}))
			);

			// Look fetched objects up by id rather than zipping arrays by index: this keeps every
			// slide -- including empty slots that were never requested -- in its original position,
			// and tolerates a response that's missing an entry, null, or out of order for any id.
			const objectBySchemaIdentifier = new Map(
				(objects ?? [])
					.filter((object): object is PlayableDisplayIeObject => !!object?.schemaIdentifier)
					.map((object) => [object.schemaIdentifier, object])
			);

			return mediaItems.map(
				(placeholder) =>
					({
						...placeholder,
						...objectBySchemaIdentifier.get(placeholder.schemaIdentifier),
					}) as PlayableDisplayIeObject
			);
		},
		enabled: schemaIdentifiers.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
