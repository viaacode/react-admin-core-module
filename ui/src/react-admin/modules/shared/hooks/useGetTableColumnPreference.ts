import { useQuery } from '@tanstack/react-query';
import { getColumnKey } from '~shared/components/FilterTable/FilterTable.utils';
import { TableColumnPreferenceService } from '~shared/services/table-column-preferences-service/table-column-preferences-service';
import { QUERY_KEYS } from '~shared/types';

export const useGetTableColumnPreference = (columnKey: string) => {
	return useQuery([QUERY_KEYS.GET_TABLE_COLUMN_PREFERENCE], async () => {
		if (!columnKey) {
			return [];
		}

		const formattedColumnKeys = getColumnKey(columnKey);
		return TableColumnPreferenceService.fetchTableColumnPreference(formattedColumnKeys);
	});
};
