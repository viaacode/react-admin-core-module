import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ContentPageService } from '~modules/content-page/services/content-page.service';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentPageByPath = (path: string, options?: UseQueryOptions<any>) => {
	return useQuery(
		[QUERY_KEYS.GET_PROFILES, path],
		(props) => {
			const path = props.queryKey[1];
			if (!path) {
				return null;
			}
			return ContentPageService.getContentPageByPath(path);
		},
		options as any
	);
};
