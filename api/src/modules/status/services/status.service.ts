import { Injectable, Logger } from '@nestjs/common';

import packageJson from '../../../../package.json';
import { TranslationsService } from '../../translations';

@Injectable()
export class StatusService {
	private logger: Logger = new Logger(StatusService.name, { timestamp: true });

	constructor(private translationsService: TranslationsService) {}

	getStatus(): Record<string, string> {
		return {
			name: 'Admin Core api',
			version: packageJson.version,
		};
	}

	async getStatusFull(): Promise<Record<string, string>> {
		return {
			...this.getStatus(),
			graphql: (await this.getGraphQlStatus()) ? 'reachable' : 'not accessible',
			// TODO add redis
		};
	}

	private async getGraphQlStatus(): Promise<boolean> {
		try {
			const translations =
				await this.translationsService.getFrontendTranslations();

			/* istanbul ignore next */
			return !!Object.keys(translations)[0];
		} catch (err) {
			this.logger.error(err);
			return false;
		}
	}
}
