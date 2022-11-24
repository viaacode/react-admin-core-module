import { Injectable } from '@nestjs/common';
import { DataService } from '../../data';
import {
	PermissionQueryTypes,
	PERMISSIONS_QUERIES,
} from '../permissions.consts';
import { PermissionData } from '../permissions.types';

@Injectable()
export class PermissionsService {
	constructor(private dataService: DataService) {}

	public async getPermissions(): Promise<PermissionData[]> {
		const response = await this.dataService.execute<
			PermissionQueryTypes['GetPermissionsQuery']
		>(
			PERMISSIONS_QUERIES[process.env.DATABASE_APPLICATION_TYPE]
				.GetPermissionsDocument,
		);

		if (
			(response as PermissionQueryTypes['GetPermissionsQueryAvo'])
				?.users_permissions
		) {
			return (
				response as PermissionQueryTypes['GetPermissionsQueryAvo']
			)?.users_permissions.map((permission) => {
				return {
					id: permission.id,
					name: permission.label,
					label: permission.description,
					description: permission.description,
				};
			});
		}

		if (
			(response as PermissionQueryTypes['GetPermissionsQueryHetArchief'])
				.users_permission
		) {
			return (
				response as PermissionQueryTypes['GetPermissionsQueryHetArchief']
			).users_permission.map((permission) => {
				return {
					id: permission.id,
					label: permission.label,
					name: permission.name,
					description: permission.description,
				};
			});
		}

		return [];
	}
}