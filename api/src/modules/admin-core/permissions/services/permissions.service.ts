import { Injectable } from '@nestjs/common';
import { DataService } from '../../data/services/data.service';
import {
	GetPermissionsDocument,
	GetPermissionsQuery,
	GetPermissionsQueryVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';

@Injectable()
export class PermissionsService {
	constructor(private dataService: DataService) {}

	public async getPermissions(): Promise<
		GetPermissionsQuery['users_permission']
	> {
		const response = await this.dataService.execute<
			GetPermissionsQuery,
			GetPermissionsQueryVariables
		>(GetPermissionsDocument);

		return response.users_permission;
	}
}
