import { useQueries } from '@tanstack/react-query';
import { type Avo } from '@viaa/avo2-types';
import { compact, kebabCase } from 'lodash-es';
import { stringifyUrl } from 'query-string';
import { MappedElement } from '~content-blocks/BlockContentEnclose/BlockContentEnclose.types';
import {
	ContentPage,
	GetContentBlockEncloseContentReturnType,
	IeObject,
} from '~content-blocks/BlockContentEnclose/hooks/useGetContentBlockEncloseContent.types';
import { AdminConfigManager } from '~core/config';
import { Locale } from '~modules/translations/translations.core.types';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import {
	getAdminCoreApiUrl,
	getProxyUrl,
} from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export const useGetContentBlockEncloseContent = (
	ids: MappedElement[],
	originalElements: { mediaItem: Avo.Core.PickerItem }[]
): GetContentBlockEncloseContentReturnType[] => {
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
			fetchWithLogoutJson<IeObject[]>(url, { headers: { referer: window.location.origin } }),
		keepPreviousData: true,
		enabled: ieObjectIds.length > 0,
	};

	const contentPageQueries = contentPageIds.map((id) => ({
		queryKey: [QUERY_KEYS.GET_CONTENT_PAGE_BY_PATH, id],
		queryFn: () => {
			if (!id) {
				return null;
			}
			return fetchWithLogoutJson<ContentPage[]>(
				stringifyUrl({
					url: `${getAdminCoreApiUrl()}/admin/content-pages/by-language-and-path`,
					query: {
						language: AdminConfigManager.getConfig().locale || Locale.Nl,
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

	const mappedResults = compact(results).flatMap((result) => {
		if (result.status === 'success') {
			if (!result.data) {
				return null;
			}
			if (Array.isArray(result.data)) {
				const ieObjects = result.data as IeObject[];
				return ieObjects.map((item: IeObject) => {
					return {
						id: item.maintainerId,
						name: item.name || item.title,
						description: item.description,
						thumbnail: item.thumbnailUrl,
						dateCreated: item.dateCreatedLowerBound,
						maintainerName: item.maintainerName,
						objectType: item.dctermsFormat,
						identifier: item.schemaIdentifier,
						pid: item.meemooIdentifier,
						link: `/zoeken/${item.maintainerSlug}/${item.schemaIdentifier}/${kebabCase(
							item.name
						)}`,
						type: 'IE_OBJECT',
					};
				});
			}

			const contentPage = result.data as ContentPage;
			return {
				id: contentPage.id,
				name: contentPage.title,
				description: contentPage.description,
				thumbnail: contentPage.thumbnailPath,
				identifier: contentPage.path,
				link: contentPage.path,
				type: 'CONTENT_PAGE',
			};
		}
	});

	return compact(
		originalElements.map((element) => {
			return mappedResults.find(
				(item) => (item && item.identifier === element?.mediaItem?.value) || null
			);
		})
	) as GetContentBlockEncloseContentReturnType[];
};
