import { type PermissionData } from '../permissions';

export interface UserGroupWithPermissions {
	id: string;
	name: string;
	label: string;
	permissions?: PermissionData[];
}
