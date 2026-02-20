import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { getColumnKey } from '~shared/components/FilterTable/FilterTable.utils';
import { TableColumnPreferenceService } from '~shared/services/table-column-preferences-service/table-column-preferences-service';

export const useUpdateTableColumnPreference = (): UseMutationResult<
	void,
	null,
	{ columnKey: string; columns: string[] }
> => {
	return useMutation({
		mutationFn: async ({ columnKey, columns }): Promise<void> => {
			const formattedColumnKey = getColumnKey(columnKey);
			await TableColumnPreferenceService.saveTableColumnPreference(formattedColumnKey, columns);
		},
	});
};
