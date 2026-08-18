import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { Theme, ThemesResponse, ThemeWithObjects } from './themes.types';

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
			return await fetchWithLogoutJson<Theme[]>(
				stringifyUrl({
					url: `${ThemesService.getBaseUrl()}/by-id`,
					query: {
						ids: ids.join(','),
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch themes by ids', err, { ids });
		}
	}

	public static async fetchThemeWithObjects(
		themeId: string | undefined
	): Promise<ThemeWithObjects | undefined> {
		if (!themeId) {
			return undefined;
		}
		try {
			return await fetchWithLogoutJson<ThemeWithObjects>(
				stringifyUrl({
					url: `${ThemesService.getBaseUrl()}/${themeId}/ie-objects`,
					query: {
						orderDirection: 'random',
						resolveThumbnailUrl: true,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch theme with objects', err, { themeId });
		}
	}
}
