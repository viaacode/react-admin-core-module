import { useQuery } from '@tanstack/react-query';
import type { HeroCarouselBlockComponentState } from '~content-blocks/BlockHeroCarousel/BlockHeroCarousel.types.ts';
import { IeObjectsService } from '~shared/services/ie-objects-service/ie-objects.service.ts';
import type { IeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import { QUERY_KEYS } from '~shared/types';

export const useGetIeObjectsByIds = (mediaItems: HeroCarouselBlockComponentState[]) => {
	const schemaIdentifiers = mediaItems
		.filter(({ mediaItem }) => !!mediaItem)
		.map(({ mediaItem }) => String(mediaItem?.value));

	return useQuery<IeObject[]>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_BY_ID, schemaIdentifiers.join(',')],
		queryFn: async () => {
			const objects = await IeObjectsService.getByIeObjectSchemaIdentifiers(
				schemaIdentifiers,
				true
			);

			return objects.map((object) => ({
				...object,
				...mediaItems.find(({ mediaItem }) => String(mediaItem?.value) === object.schemaIdentifier),
			}));
		},
		enabled: schemaIdentifiers.length > 0,
	});
};
