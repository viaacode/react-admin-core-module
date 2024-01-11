import { useQuery } from '@tanstack/react-query';
import { ContentPickerType } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { QUERY_KEYS } from '~shared/types';

export const useGetStillsFromContentItem = (
	contentItemType:
		| ContentPickerType.ITEM
		| ContentPickerType.COLLECTION
		| ContentPickerType.ASSIGNMENT
		| null,
	contentItemId: string | null,
	options: { enabled?: boolean } = {}
) => {
	return useQuery<string[]>(
		[QUERY_KEYS.GET_VIDEO_STILLS_FOR_CONTENT_ITEM, contentItemType, contentItemType],
		() => {
			if (!contentItemType || !contentItemId) {
				return [];
			}
			return fetchWithLogoutJson(
				stringifyUrl({
					url: `http://localhost:3000/video-stills/by-content`,
					// url: `${AdminConfigManager.getConfig().database.proxyUrl}/video-stills/by-content`,
					query: {
						contentItemType,
						contentItemId,
					},
				})
			);
		},
		{ enabled: true, ...options }
	);
};
