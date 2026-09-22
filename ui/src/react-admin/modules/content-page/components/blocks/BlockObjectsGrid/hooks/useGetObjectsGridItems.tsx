import { useQuery } from '@tanstack/react-query';
import type { PickerItem } from '~modules/shared/types/content-picker';
import { QUERY_KEYS } from '~shared/types';
import {
	DEFAULT_OBJECTS_GRID_LIMIT,
	getObjectsGridItems,
	type ObjectsGridData,
} from '../BlockObjectsGrid.service';

export const useGetObjectsGridItems = (
	searchQuery: string,
	fixedItems: PickerItem[],
	limit = DEFAULT_OBJECTS_GRID_LIMIT
) => {
	return useQuery<ObjectsGridData>({
		queryKey: [
			QUERY_KEYS.GET_OBJECTS_GRID_ITEMS,
			searchQuery,
			limit,
			fixedItems.map((item) => item.value).join(','),
		],
		queryFn: () => getObjectsGridItems(searchQuery, fixedItems, limit),
		// FA: a different random selection should be shown on every (full page) load, but
		// navigating to a detail page and back shouldn't reshuffle the grid. The query cache
		// is in-memory and reset on a full reload, so never marking this stale keeps the same
		// objects for the lifetime of that cache while still randomizing on reload.
		staleTime: Infinity,
		enabled: Boolean(searchQuery) || fixedItems.length > 0,
	});
};
