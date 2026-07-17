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
		// FA: a different random selection should be shown on every load, so don't serve stale data.
		staleTime: 0,
		enabled: Boolean(searchQuery) || fixedItems.length > 0,
	});
};
