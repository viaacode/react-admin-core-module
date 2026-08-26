import { useQuery } from '@tanstack/react-query';
import { ThemesService } from '~shared/services/themes-service/themes.service';
import type { Theme } from '~shared/services/themes-service/themes.types';
import { QUERY_KEYS } from '~shared/types';

/**
 * The themes endpoint pages its results, but a picker needs the whole list at once. Themes are an
 * editorial set that meemoo curates by hand, so the count stays low and one large page is enough.
 * Raise this only together with a real paging/search implementation in the picker.
 */
const ALL_THEMES_PAGE_SIZE = 500;

/**
 * All themes, sorted by slug. The Driekeuzespeler picker shows slugs and orders them
 * alphabetically: https://meemoo.atlassian.net/wiki/spaces/HA2/pages/6218383419
 */
export const useGetAllThemes = () => {
	return useQuery<Theme[]>({
		queryKey: [QUERY_KEYS.GET_ALL_THEMES],
		queryFn: async () => {
			const response = await ThemesService.fetchThemes(null, 0, ALL_THEMES_PAGE_SIZE);

			// The endpoint can order by slug, but sorting here keeps the picker alphabetical even
			// when the response order changes.
			return [...response.items].sort((left, right) => left.slug.localeCompare(right.slug));
		},
	});
};
