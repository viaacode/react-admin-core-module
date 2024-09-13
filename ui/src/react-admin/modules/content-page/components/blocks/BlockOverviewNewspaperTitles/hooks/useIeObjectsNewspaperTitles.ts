import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '~shared/types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { NewspaperTitle } from '~content-blocks/BlockOverviewNewspaperTitles/BlockOverviewNewspaperTitles.types';

export const useGetNewspaperTitles = () => {
	return useQuery(
		[QUERY_KEYS.GET_IE_OBJECTS_NEWSPAPER_TITLES],
		() => fetchWithLogoutJson<NewspaperTitle[]>(`${getProxyUrl()}/newspapers/newspaper-titles`),
		{
			keepPreviousData: true,
			enabled: true,
			staleTime: 3600000,
		}
	);
};
