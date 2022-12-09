import { HTTPError } from 'ky';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AdminConfigManager } from '~core/config';
import { PERMISSIONS_QUERY_KEYS } from '~modules/permissions/const/permissions.const';
import { PermissionData } from '~modules/permissions/types/permissions.types';
import { fetchWithLogoutJson } from '~modules/shared/helpers/fetch-with-logout';

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
			return fetchWithLogoutJson<PermissionData[]>(
				AdminConfigManager.getConfig().database.proxyUrl + '/permissions'
			);
		},
		{
			...options,
			enabled: !!options.enabled,
		}
	);
};
