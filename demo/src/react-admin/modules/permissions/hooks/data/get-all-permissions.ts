import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from 'react-query';
import { Config } from '~core/config';
import { PERMISSIONS_QUERY_KEYS } from '~modules/permissions/const/permissions.const';
import { PermissionData } from '~modules/permissions/types/permissions.types';

export const useGetPermissions = <TData = PermissionData[]>(
	options: UseQueryOptions<PermissionData[], HTTPError, TData, typeof PERMISSIONS_QUERY_KEYS.all> = {
		enabled: true,
	}
) => {
	return useQuery(
		PERMISSIONS_QUERY_KEYS.all,
		() => Config.getConfig().services.PermissionsService.getAllPermissions() as Promise<PermissionData[]>,
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};