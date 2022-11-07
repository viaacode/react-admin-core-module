import { PermissionResponse } from '../permissions';

export interface UserGroupsResponse {
	id: string;
	name: string;
	label: string;
	permissions: PermissionResponse[];
}
