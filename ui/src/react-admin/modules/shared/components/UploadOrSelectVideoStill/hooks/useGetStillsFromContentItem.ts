import { useQuery } from '@tanstack/react-query';
import { ContentPickerType } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config/config.class';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetStillsFromContentItem = (
	contentItemType: ContentPickerType | null,
	contentItemId: string | null,
	options: { enabled?: boolean } = {
		enabled: true,
	}
) => {
	return useQuery<string[]>({
		queryKey: [QUERY_KEYS.GET_VIDEO_STILLS_FOR_CONTENT_ITEM, contentItemType, contentItemId],
		queryFn: async () => {
			if (!contentItemType || !contentItemId) {
				return [];
			}

			if (
				contentItemType !== ContentPickerType.ITEM &&
				contentItemType !== ContentPickerType.ITEM_WITH_CUE_POINTS &&
				contentItemType !== ContentPickerType.COLLECTION &&
				contentItemType !== ContentPickerType.ASSIGNMENT
			) {
				return [];
			}
			const stills: string[] = await fetchWithLogoutJson(
				stringifyUrl({
					url: `${getProxyUrl()}/video-stills/by-content`,
					query: {
						contentItemType,
						contentItemId,
					},
				})
			);
			return stills.map((still) => {
				if (still === 'AUDIO_WAVE_FORM') {
					return AdminConfigManager.getConfig().components.defaultAudioStill;
				} else {
					return still;
				}
			});
		},
		enabled: true,
		...options,
	});
};
