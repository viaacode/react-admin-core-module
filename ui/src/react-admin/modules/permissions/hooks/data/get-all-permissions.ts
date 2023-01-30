import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AdminConfigManager } from '~core/config';
import { PermissionData } from '~modules/permissions/permissions.types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
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
				AdminConfigManager.getConfig().database.proxyUrl + '/admin/permissions'
			);
		},
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
