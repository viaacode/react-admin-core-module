import { ApiService } from '~modules/shared/services/api-service';
import { PermissionData } from '../types/permissions.types';

import { PERMISSIONS_SERVICE_BASE_URL } from './permissions.const';

export class PermissionsService {
	public static async getAllPermissions(): Promise<PermissionData[]> {
		return await ApiService.getApi()
			.get(PERMISSIONS_SERVICE_BASE_URL).json();
	}
}
