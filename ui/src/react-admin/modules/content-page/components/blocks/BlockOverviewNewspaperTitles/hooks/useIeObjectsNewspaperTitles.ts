import { useQuery } from '@tanstack/react-query';
import type { NewspaperTitle } from '~content-blocks/BlockOverviewNewspaperTitles/BlockOverviewNewspaperTitles.types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetNewspaperTitles = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_IE_OBJECTS_NEWSPAPER_TITLES],
		queryFn: () =>
			fetchWithLogoutJson<NewspaperTitle[]>(`${getProxyUrl()}/newspapers/newspaper-titles`),
		enabled: true,
		staleTime: 3600000,
	});
};
