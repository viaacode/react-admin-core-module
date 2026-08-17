import { useQuery } from '@tanstack/react-query';
import { compact, keyBy } from 'es-toolkit/compat';
import { stringifyUrl } from 'query-string';
import type { IeObjectMediaInfo } from '~shared/components/IeObjectMedia';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

/**
 * Resolves the ie-objects for all timeline nodes with visualType OBJECT in a single request.
 * Same endpoint the hetarchief client uses: IeObjectsService.getBySchemaIdentifiers()
 * @param pids the schema identifiers of the ie-objects. eg: qsqn5z7j6q
 */
const fetchTimelineIeObjects = async (
	pids: string[]
): Promise<Record<string, IeObjectMediaInfo>> => {
	try {
		const ieObjects = await fetchWithLogoutJson<(IeObjectMediaInfo | null)[]>(
			stringifyUrl({
				url: `${getProxyUrl()}/ie-objects`,
				query: {
					schemaIdentifiers: pids,
					resolveThumbnailUrl: true,
				},
			})
		);
		return keyBy(compact(ieObjects), (ieObject) => ieObject.schemaIdentifier);
	} catch (err) {
		throw new CustomError('Failed to fetch ie-objects for the timeline block', err, { pids });
	}
};

export const useGetTimelineIeObjects = (pids: string[]) => {
	return useQuery<Record<string, IeObjectMediaInfo>>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECT, ...pids],
		queryFn: () => fetchTimelineIeObjects(pids),
		enabled: pids.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
