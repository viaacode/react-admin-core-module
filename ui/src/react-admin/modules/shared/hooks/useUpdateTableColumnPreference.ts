import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { getColumnKey } from '~shared/components/FilterTable/FilterTable.utils';
import { TableColumnPreferenceService } from '~shared/services/table-column-preferences-service/table-column-preferences-service';

export const useUpdateTableColumnPreference = (
	columnKey: string
): UseMutationResult<void, null, string[]> => {
	const formattedColumnKey = getColumnKey(columnKey);

	return useMutation({
		mutationFn: async (columns: string[]): Promise<void> => {
			await TableColumnPreferenceService.saveTableColumnPreference(formattedColumnKey, columns);
		},
	});
};
