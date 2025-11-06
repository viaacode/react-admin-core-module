import { CustomError } from '~shared/helpers/custom-error.js';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout.js';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config.js';
import { isAvo } from '~shared/helpers/is-avo.js';

export class TableColumnPreferenceService {
	private static columnsMap: Map<string, string[]> = new Map<string, string[]>();

	private static getBaseUrl(): string {
		return `${getAdminCoreApiUrl()}/admin/table-column-preferences`;
	}

	public static async fetchTableColumnPreference(columnKey: string): Promise<string[]> {
		try {
			if (TableColumnPreferenceService.columnsMap.has(columnKey)) {
				return TableColumnPreferenceService.columnsMap.get(columnKey) as string[];
			}

			let result: string[];

			if (isAvo()) {
				result = await fetchWithLogoutJson<string[]>(
					`${TableColumnPreferenceService.getBaseUrl()}/${columnKey}`
				);
			} else {
				result = [];
			}

			TableColumnPreferenceService.columnsMap.set(columnKey, result);
			return TableColumnPreferenceService.columnsMap.get(columnKey) as string[];
		} catch (err) {
			throw new CustomError('Failed to get table column preference from the database', err);
		}
	}

	public static async saveTableColumnPreference(
		columnKey: string,
		columns: string[]
	): Promise<void> {
		try {
			let result: string[];

			if (isAvo()) {
				result = await fetchWithLogoutJson<string[]>(
					`${TableColumnPreferenceService.getBaseUrl()}/${columnKey}`,
					{
						method: 'POST',
						body: JSON.stringify(columns),
					}
				);
			} else {
				result = [...columns];
			}

			TableColumnPreferenceService.columnsMap.set(columnKey, result);
		} catch (err) {
			throw new CustomError('Failed to get table column preference from the database', err);
		}
	}
}
