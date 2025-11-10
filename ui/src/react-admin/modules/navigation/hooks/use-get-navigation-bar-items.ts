import { useQuery } from '@tanstack/react-query';
import { compact } from 'es-toolkit';
import { NavigationService } from '~modules/navigation/navigation.service.js';
import type { Locale } from '~modules/translations/translations.core.types.js';
import { QUERY_KEYS } from '~shared/types/index.js';
import { reindexNavigationItems } from '../helpers/reorder-navigation-items.js';

export const useGetNavigationBarItems = (
	placement?: string,
	languages?: Locale[],
	searchTerm?: string,
	orderProperty?: string,
	orderDirection?: string,
	options: { keepPreviousData?: boolean; gcTime?: number } = {}
) => {
	return useQuery({
		queryKey: compact([
			QUERY_KEYS.GET_NAVIGATION_BAR_ITEMS,
			placement,
			(languages || []).join(','),
			searchTerm,
		]),
		queryFn: async () => {
			if (!placement) {
				return [];
			}
			const navItems = await NavigationService.fetchNavigationBarItems(
				placement,
				languages,
				searchTerm,
				orderProperty,
				orderDirection
			);
			reindexNavigationItems(navItems);
			return navItems;
		},
		placeholderData: undefined,
		gcTime: 300000,
		...options,
	});
};
