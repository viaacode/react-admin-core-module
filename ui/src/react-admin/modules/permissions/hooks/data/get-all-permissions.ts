import { useQuery } from '@tanstack/react-query';
import type { PermissionData } from '~modules/permissions/permissions.types.js';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout.js';
import { getAdminCoreApiUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config.js';
import { QUERY_KEYS } from '~shared/types/index.js';

export const useGetPermissions = () => {
	return useQuery({
		queryKey: [QUERY_KEYS.GET_ALL_PERMISSIONS],
		queryFn: () => {
			return fetchWithLogoutJson<PermissionData[]>(`${getAdminCoreApiUrl()}/admin/permissions`);
		},
	});
};
