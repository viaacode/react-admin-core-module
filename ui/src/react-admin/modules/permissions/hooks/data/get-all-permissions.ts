import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { PERMISSIONS_QUERY_KEYS } from '~modules/permissions/const/permissions.const';
import { PermissionService } from '~modules/permissions/permission.service';
import { PermissionData } from '~modules/permissions/permissions.types';

export const useGetPermissions = <TData = PermissionData[]>(
	options: UseQueryOptions<
		PermissionData[],
		HTTPError,
		TData,
		typeof PERMISSIONS_QUERY_KEYS.all
	> = {
		enabled: true,
	}
) => {
	return useQuery(
		PERMISSIONS_QUERY_KEYS.all,
		() => {
			return PermissionService.getAllPermissions();
		},
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
