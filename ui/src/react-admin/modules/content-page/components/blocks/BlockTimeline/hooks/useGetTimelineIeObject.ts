import { useQuery } from '@tanstack/react-query';
import { CustomError } from '~shared/helpers/custom-error';
import { fetchWithLogoutJson } from '~shared/helpers/fetch-with-logout';
import { getProxyUrl } from '~shared/helpers/get-proxy-url-from-admin-core-config';
import { QUERY_KEYS } from '~shared/types';

export type TimelineIeObjectMediaType = 'video' | 'audio' | 'newspaper' | 'unknown';

export interface TimelineIeObjectData {
	schemaIdentifier: string;
	name: string;
	description?: string;
	thumbnailUrl?: string;
	src?: string;
	duration?: string;
	mediaType: TimelineIeObjectMediaType;
	maintainerName?: string;
	maintainerLogo?: string;
	detailPageUrl?: string;
}


interface RawIeObject {
	schema_identifier?: string;
	name?: string;
	description?: string;
	thumbnail_url?: string;
	representations?: { browse_path?: string; dcterms_format?: string }[];
	duration?: string;
	dcterms_format?: string;
	maintainer_name?: string;
	maintainer_logo?: string;
	detail_page_url?: string;
}

const getMediaType = (raw: RawIeObject): TimelineIeObjectMediaType => {
	const format = (raw.dcterms_format || raw.representations?.[0]?.dcterms_format || '').toLowerCase();
	if (format.includes('video')) {
		return 'video';
	}
	if (format.includes('audio')) {
		return 'audio';
	}
	if (format.includes('newspaper') || format.includes('krant')) {
		return 'newspaper';
	}
	return 'unknown';
};

const parseIeObject = (raw: RawIeObject): TimelineIeObjectData => ({
	schemaIdentifier: raw.schema_identifier || '',
	name: raw.name || '',
	description: raw.description,
	thumbnailUrl: raw.thumbnail_url,
	src: raw.representations?.[0]?.browse_path,
	duration: raw.duration,
	mediaType: getMediaType(raw),
	maintainerName: raw.maintainer_name,
	maintainerLogo: raw.maintainer_logo,
	detailPageUrl: raw.detail_page_url,
});

// Reuses the same `/ie-objects` search endpoint the content picker uses (there is no
// dedicated single-object endpoint in this proxy), filtering on the exact identifier.
const fetchTimelineIeObject = async (pid: string): Promise<TimelineIeObjectData | null> => {
	try {
		const response: { items: RawIeObject[] } = await fetchWithLogoutJson(
			`${getProxyUrl()}/ie-objects`,
			{
				method: 'POST',
				body: JSON.stringify({
					filters: [{ field: 'schema_identifier', operator: 'contains', value: pid }],
					size: 1,
					page: 0,
				}),
			}
		);
		const raw = response.items?.[0];
		return raw ? parseIeObject(raw) : null;
	} catch (err) {
		throw new CustomError('Failed to fetch ie-object for timeline node', err, { pid });
	}
};

export const useGetTimelineIeObject = (pid: string | undefined) => {
	return useQuery<TimelineIeObjectData | null>({
		queryKey: [QUERY_KEYS.GET_IE_OBJECT, pid],
		queryFn: () => fetchTimelineIeObject(pid as string),
		enabled: !!pid,
		staleTime: 3600000,
	});
};
