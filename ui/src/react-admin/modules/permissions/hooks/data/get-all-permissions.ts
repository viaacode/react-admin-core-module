import type { UseQueryOptions } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import type { PermissionData } from '~modules/permissions/permissions.types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetPermissions = <TData = PermissionData[]>(
	options: UseQueryOptions<PermissionData[], any, TData, QUERY_KEYS[]> = {
		enabled: true,
	}
) => {
	return useQuery(
		[QUERY_KEYS.GET_ALL_PERMISSIONS],
		() => {
			return fetchWithLogoutJson<PermissionData[]>(
				getAdminCoreApiUrl() + '/admin/permissions'
			);
		},
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
