import { useQueries } from '@tanstack/react-query';
import { ContentPickerType } from '@viaa/avo2-types';
import { compact } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import {
	EnclosedContent,
	MappedElement,
} from '~content-blocks/BlockContentEnclose/BlockContentEnclose.types';
import { LanguageCode } from '~modules/translations/translations.core.types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import {
	getAdminCoreApiUrl,
	getProxyUrl,
} from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentBlockEncloseContent = (ids: MappedElement[]): EnclosedContent[] => {
	const ieObjectIds = ids
		.filter((id) => id.type === ContentPickerType.IE_OBJECT)
		.map((id) => id.value);

	const contentPageIds = ids
		.filter((id) => id.type === ContentPickerType.CONTENT_PAGE)
		.map((id) => id.value);

	const ieObjectQuery = {
		queryKey: [QUERY_KEYS.GET_IE_OBJECT],
		queryFn: () =>
			fetchWithLogoutJson<any[]>(
				stringifyUrl({
					url: `${getProxyUrl()}/ie-objects`,
					query: {
						id: ieObjectIds,
					},
				})
			),
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
						language: LanguageCode.Nl,
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
					id: item.id,
					name: item.name,
					description: item.description,
					thumbnail: item.thumbnail_path,
				};
			});
		}

		return {
			id: result.data.id,
			name: result.data.title,
			description: result.data.description,
			thumbnail: result.data.thumbnailPath,
		};
	}) as any;
};
