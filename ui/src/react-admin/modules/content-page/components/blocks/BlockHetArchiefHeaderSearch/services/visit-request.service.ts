import type { IPagination } from '@studiohyperdrive/pagination';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { stringifyUrl } from 'query-string';
import { CustomError } from '~shared/helpers/custom-error.ts';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout.ts';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config.ts';

export class VisitRequestService {
	private static getBaseUrl(): string {
		return `${getProxyUrl()}/visits`;
	}

	public static async hasAccessToVisitorSpaces(): Promise<boolean> {
		try {
			const result = await fetchWithLogoutJson<IPagination<unknown>>(
				stringifyUrl({
					url: `${VisitRequestService.getBaseUrl()}/personal`,
					query: {
						page: 1,
						size: 100,
						orderProp: 'startAt',
						orderDirection: AvoSearchOrderDirection.DESC,
						status: 'APPROVED',
						timeframe: 'ACTIVE',
					},
				})
			);

			console.log('result', result);
			return (result.items?.length || 0) > 0;
		} catch (err) {
			throw new CustomError('Failed to fetch visitor spaces', err);
		}
	}
}
