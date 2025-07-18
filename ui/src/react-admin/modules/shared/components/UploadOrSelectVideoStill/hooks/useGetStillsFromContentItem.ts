import { useQuery } from '@tanstack/react-query';
import type { ContentPickerType } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { AdminConfigManager } from '~core/config';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetStillsFromContentItem = (
	contentItemType:
		| ContentPickerType.ITEM
		| ContentPickerType.COLLECTION
		| ContentPickerType.ASSIGNMENT
		| null,
	contentItemId: string | null,
	options: { enabled?: boolean; keepPreviousData?: boolean } = {
		enabled: true,
		keepPreviousData: true,
	}
) => {
	return useQuery<string[]>(
		[QUERY_KEYS.GET_VIDEO_STILLS_FOR_CONTENT_ITEM, contentItemType, contentItemId],
		async () => {
			if (!contentItemType || !contentItemId) {
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
		{
			enabled: true,
			keepPreviousData: true,
			...options,
		}
	);
};
