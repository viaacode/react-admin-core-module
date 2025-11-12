import { useQuery } from '@tanstack/react-query';
import type { NewspaperTitle } from '~content-blocks/BlockOverviewNewspaperTitles/BlockOverviewNewspaperTitles.types.js';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout.js';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config.js';
import { QUERY_KEYS } from '~shared/types/index.js';

export const useGetNewspaperTitles = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_NEWSPAPER_TITLES],
		queryFn: () =>
			fetchWithLogoutJson<NewspaperTitle[]>(`${getProxyUrl()}/newspapers/newspaper-titles`),
		enabled: true,
		staleTime: 3600000,
	});
};
