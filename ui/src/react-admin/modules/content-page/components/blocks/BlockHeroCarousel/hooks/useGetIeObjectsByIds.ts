import { useQuery } from '@tanstack/react-query';
import type { HeroCarouselSlideItem } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

export const useGetIeObjectsByIds = (mediaItems: HeroCarouselSlideItem[]) => {
	const schemaIdentifiers = mediaItems.map(({ schemaIdentifier }) => schemaIdentifier);

	return useQuery<PlayableDisplayIeObject[]>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_ID, schemaIdentifiers.join(',')],
		placeholderData: mediaItems,
		queryFn: async () => {
			const objects = await IeObjectsService.getPlayableDisplayData(
				mediaItems.map((item) => ({
					schemaIdentifier: item.schemaIdentifier,
					start: item.cuepoints?.start,
					end: item.cuepoints?.end,
				}))
			);

			return objects.map((object) => {
				const placeholder = mediaItems.find(
					({ schemaIdentifier }) => schemaIdentifier === object.schemaIdentifier
				);
				return {
					...placeholder,
					...object,
				};
			});
		},
		enabled: schemaIdentifiers.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
