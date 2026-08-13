import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import type { IeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';

export class IeObjectsService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/ie-objects`;
	}

	public static async getByIeObjectSchemaIdentifiers(
		schemaIdentifiers: string[],
		resolveThumbnailUrl: boolean
	): Promise<IeObject[]> {
		try {
			return await fetchWithLogoutJson<IeObject[]>(
				stringifyUrl({
					url: IeObjectsService.getBaseUrl(),
					query: {
						schemaIdentifiers,
						resolveThumbnailUrl,
					},
				})
			);
		} catch (err) {
			throw new CustomError('Failed to fetch themes', err, {
				schemaIdentifiers,
				resolveThumbnailUrl,
			});
		}
	}
}
