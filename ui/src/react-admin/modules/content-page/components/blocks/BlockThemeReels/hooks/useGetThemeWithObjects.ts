import { useQuery } from '@tanstack/react-query';
import { ThemesService } from '~shared/services/themes-service/themes.service';
import type { ThemeWithObjects } from '~shared/services/themes-service/themes.types';
import { QUERY_KEYS } from '~shared/types';

export const useGetThemeWithObjects = (themeId: string) => {
	return useQuery<ThemeWithObjects | undefined>({
		queryKey: [QUERY_KEYS.GET_THEME_WITH_OBJECTS, themeId],
		queryFn: () => ThemesService.fetchThemeWithObjects(themeId),
		enabled: !!themeId,
		gcTime: 0,
		staleTime: 0,
	});
};
