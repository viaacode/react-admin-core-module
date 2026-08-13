import { useQuery } from '@tanstack/react-query';
import { compact, keyBy } from 'es-toolkit/compat';
import { stringifyUrl } from 'query-string';
import type {
	IeObjectRepresentation,
	IeObjectType,
} from '~shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer.types';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

/**
 * The subset of the ie-object we need to render a timeline node.
 * The proxy returns camel case properties for this endpoint.
 */
export interface TimelineIeObject {
	schemaIdentifier: string;
	name: string;
	thumbnailUrl?: string;
	dctermsFormat: IeObjectType | null;
	duration?: string;
	maintainerName?: string;
	maintainerLogo?: string | null;
	maintainerOverlay?: boolean | null;
	pages?: { representations: IeObjectRepresentation[] }[];
}

/**
 * Resolves the ie-objects for all timeline nodes with visualType OBJECT in a single request.
 * Same endpoint the hetarchief client uses: IeObjectsService.getBySchemaIdentifiers()
 * @param pids the schema identifiers of the ie-objects. eg: qsqn5z7j6q
 */
const fetchTimelineIeObjects = async (
	pids: string[]
): Promise<Record<string, TimelineIeObject>> => {
	try {
		const ieObjects = await fetchWithLogoutJson<(TimelineIeObject | null)[]>(
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
	return useQuery<Record<string, TimelineIeObject>>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECT, ...pids],
		queryFn: () => fetchTimelineIeObjects(pids),
		enabled: pids.length > 0,
		staleTime: 60 * 60 * 1000, // 1 hour
	});
};
