import { FilterableTableState } from '../../shared/components/FilterTable/FilterTable';

import { Permission } from '~modules/user/user.types';
import { PermissionData } from '~modules/permissions/types/permissions.types';

export enum UserGroups {
	KIOSK_VISITOR = 'KIOSK_VISITOR',
	MEEMOO_ADMIN = 'MEEMOO_ADMIN',
	VISITOR = 'VISITOR',
	CP_ADMIN = 'CP_ADMIN',
}

export interface UserGroupOverviewProps {
	onChangePermissions?: (hasChanges: boolean) => void;
}

export interface UserGroupOverviewRef {
	onCancel: () => void;
	onSave: () => void;
}

export interface UserGroup {
	id: number | string;
	label: string;
	description: string | null;
	created_at: string;
	updated_at: string;
	permissions: Permission[];
}

export interface UserGroupEditFormErrorState {
	label?: string;
	description?: string;
}

export interface UserGroupTableState extends FilterableTableState {
	label: string;
	description: string;
	created_at: string;
	updated_at: string;
}

export type UserGroupOverviewTableCols =
	| 'label'
	| 'description'
	| 'created_at'
	| 'updated_at'
	| 'actions';

export type PermissionGroupTableCols =
	| 'label'
	| 'description'
	| 'created_at'
	| 'updated_at'
	| 'actions';

export interface UserGroupArchief {
	id: number | string;
	name: string;
	permissions: PermissionData[];
}

export type PermissionRow = { row: { original: PermissionData } };

export interface UserGroupUpdates {
	updates: UserGroupUpdate[]
}

export interface UserGroupUpdate {
		userGroupId: string;
		permissionId:string;
		hasPermission: boolean;
}

export interface UserGroupUpdateResponse {
	deleted: number;
	inserted: number;
}
