import { Injectable, Logger } from '@nestjs/common';

import packageJson from '../../../../package.json';
import { DataService } from '../../admin-core/data/services/data.service';
import {
	GetFirstObjectIdDocument,
	GetFirstObjectIdQuery,
} from '../../admin-core/shared/generated/graphql-db-types-hetarchief';

@Injectable()
export class StatusService {
	private logger: Logger = new Logger(StatusService.name, { timestamp: true });

	constructor(private dataService: DataService) {}

	getStatus(): Record<string, string> {
		return {
			name: 'HetArchief proxy service',
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
			const response = await this.dataService.execute<GetFirstObjectIdQuery>(
				GetFirstObjectIdDocument,
			);

			/* istanbul ignore next */
			return !!response?.object_ie?.[0]?.schema_identifier;
		} catch (err) {
			this.logger.error(err);
			return false;
		}
	}
}
