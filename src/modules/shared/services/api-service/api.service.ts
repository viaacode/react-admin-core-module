import ky from 'ky-universal';
import { KyInstance } from 'ky/distribution/types/ky';

import { Config } from '../../../../core/config';

export abstract class ApiService {
	private static api: KyInstance | null = null;

	public static getApi(): KyInstance {
		if (!ApiService.api) {
			this.api = ky.create({
				prefixUrl: Config.getConfig().database.proxyUrl,
				headers: {
					'content-type': 'application/json',
				},
				credentials: 'include', // TODO change to same-origin once working on server
			});
		}
		return this.api as KyInstance;
	}
}
