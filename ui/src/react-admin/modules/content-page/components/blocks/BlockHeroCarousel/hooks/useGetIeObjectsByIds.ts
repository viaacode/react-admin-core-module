import { useQuery } from '@tanstack/react-query';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { toSeconds } from '~shared/helpers/parsers/duration.ts';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

export const useGetIeObjectsByIds = (mediaItems: HeroCarouselBlockComponentState[]) => {
	const filteredItems = mediaItems.filter(({ mediaItem }) => !!mediaItem);
	const schemaIdentifiers = filteredItems.map(({ mediaItem }) => String(mediaItem?.value));

	return useQuery<PlayableDisplayIeObject[]>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_ID, schemaIdentifiers.join(',')],
		queryFn: async () => {
			const objects = await IeObjectsService.getPlayableDisplayData(
				filteredItems.map((item) => ({
					schemaIdentifier: String(item.mediaItem?.value),
					start: item.startCuePoint
						? (toSeconds(item.startCuePoint, true) ?? undefined)
						: undefined,
					end: item.endCuePoint ? (toSeconds(item.endCuePoint, true) ?? undefined) : undefined,
				}))
			);

			return objects.map((object) => ({
				...object,
				...mediaItems.find(({ mediaItem }) => String(mediaItem?.value) === object.schemaIdentifier),
			}));
		},
		enabled: schemaIdentifiers.length > 0,
	});
};
