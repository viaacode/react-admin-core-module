import { useQueries } from '@tanstack/react-query';
import { compact } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import {
	EnclosedContent,
	MappedElement,
} from '~content-blocks/BlockContentEnclose/BlockContentEnclose.types';
import { Locale } from '~modules/translations/translations.core.types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import {
	getAdminCoreApiUrl,
	getProxyUrl,
} from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentBlockEncloseContent = (ids: MappedElement[]): EnclosedContent[] => {
	const ieObjectIds = ids.filter((id) => id.type === 'IE_OBJECT').map((id) => id.value);

	const contentPageIds = ids.filter((id) => id.type === 'CONTENT_PAGE').map((id) => id.value);

	const url = stringifyUrl({
		url: `${getProxyUrl()}/ie-objects`,
		query: {
			id: ieObjectIds,
		},
	});
	const ieObjectQuery = {
		queryKey: [QUERY_KEYS.GET_IE_OBJECT],
		queryFn: () =>
			fetchWithLogoutJson<any[]>(url, { headers: { referer: window.location.origin } }),
		keepPreviousData: true,
		enabled: ieObjectIds.length > 0,
	};

	const contentPageQueries = contentPageIds.map((id) => ({
		queryKey: [QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH, id],
		queryFn: () => {
			if (!id) {
				return null;
			}
			return fetchWithLogoutJson<any[]>(
				stringifyUrl({
					url: `${getAdminCoreApiUrl()}/admin/content-pages/by-language-and-path`,
					query: {
						language: Locale.Nl,
						path: id,
						onlyInfo: 'false',
					},
				})
			);
		},
	}));

	const results = useQueries({
		queries: [...(ieObjectIds.length > 0 ? [ieObjectQuery] : []), ...contentPageQueries],
	});

	return compact(results).flatMap((result: any) => {
		if (!result.data) {
			return null;
		}
		if (Array.isArray(result.data)) {
			return result.data.map((item: any) => {
				return {
					id: item.maintainerId,
					name: item.name,
					description: item.description,
					thumbnail: item.thumbnailUrl,
					dateCreated: item.dateCreatedLowerBound,
					maintainerName: item.maintainerName,
					icon: item.ebucoreObjectType,
					type: 'IE_OBJECT',
				};
			});
		}

		return {
			id: result.data.id,
			name: result.data.title,
			description: result.data.description,
			thumbnail: result.data.thumbnailPath,
			type: 'CONTENT_PAGE',
		};
	}) as any;
};
