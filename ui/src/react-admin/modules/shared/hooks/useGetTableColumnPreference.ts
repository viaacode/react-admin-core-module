import { useQuery } from '@tanstack/react-query';
import { getColumnKey } from '~shared/components/FilterTable/FilterTable.utils.js';
import { TableColumnPreferenceService } from '~shared/services/table-column-preferences-service/table-column-preferences-service.js';
import { QUERY_KEYS } from '~shared/types/index.js';

export const useGetTableColumnPreference = (columnKey: string) => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_TABLE_COLUMN_PREFERENCE],
		queryFn: async () => {
			if (!columnKey) {
				return [];
			}

			const formattedColumnKeys = getColumnKey(columnKey);
			return TableColumnPreferenceService.fetchTableColumnPreference(formattedColumnKeys);
		},
	});
};
