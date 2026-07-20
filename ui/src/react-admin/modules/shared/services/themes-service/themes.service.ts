import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { Theme, ThemesResponse } from './themes.types';

export class ThemesService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/themes`;
	}

	public static async fetchThemes(
		searchTerm: string | null = null,
		page = 0,
		size = 20
	): Promise<ThemesResponse> {
		try {
			return await fetchWithLogoutJson<ThemesResponse>(
				stringifyUrl({
					url: ThemesService.getBaseUrl(),
					query: {
						searchTerm: searchTerm || undefined,
						page,
						size,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch themes', err, { searchTerm, page, size });
		}
	}

	public static async fetchThemesByIds(ids: string[]): Promise<Theme[]> {
		if (!ids.length) {
			return [];
		}
		try {
			// The themes endpoint doesn't support filtering by ids, so we fetch a large page and filter client-side.
			// Themes are a bounded editorial taxonomy, so this is expected to stay small.
			const response = await ThemesService.fetchThemes(null, 0, 1000);
			const idSet = new Set(ids);
			return response.items.filter((theme) => idSet.has(theme.id));
		} catch (err) {
			throw new CustomError('Failed to fetch themes by ids', err, { ids });
		}
	}
}
