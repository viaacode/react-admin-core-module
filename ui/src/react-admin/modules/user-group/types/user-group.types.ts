import { ReactNode } from 'react';
import { PermissionData } from '~modules/permissions/permissions.types';

export interface UserGroupOverviewProps {
	onChangePermissions?: (hasChanges: boolean) => void;
	renderSearchButtons?: (search?: string) => ReactNode;
	className?: string;
}

export interface UserGroupOverviewRef {
	onCancel: () => void;
	onSave: () => void;
	onSearch: (value?: string) => void;
}

export interface UserGroup {
	id: string;
	name: string;
	label: string;
}

export interface UserGroupWithPermissions extends UserGroup {
	permissions: PermissionData[];
}

export type PermissionRow = { row: { original: PermissionData } };

export interface UserGroupUpdates {
	updates: UserGroupUpdate[];
}

export interface UserGroupUpdate {
	userGroupId: string;
	permissionId: string | number;
	hasPermission: boolean;
}
