import { useQuery } from '@tanstack/react-query';
import { ThemesService } from '~shared/services/themes-service/themes.service';
import type { Theme } from '~shared/services/themes-service/themes.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetThemesByIds = (ids: string[]) => {
	return useQuery<Theme[]>({
		queryKey: [QUERY_KEYS.GET_THEMES_BY_IDS, ...ids],
		queryFn: () => ThemesService.fetchThemesByIds(ids),
		enabled: ids.length > 0,
	});
};
