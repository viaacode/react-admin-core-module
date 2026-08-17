import type { IeObjectRepresentation } from '~shared/components/AudioOrVideoPlayer/AudioOrVideoPlayer.types';
import type { IeObjectType } from '~shared/helpers/mapFormatToType.ts';

/**
 * The subset of an ie-object that is needed to render its media (player or thumbnail).
 * The proxy returns camel case properties for this endpoint.
 */
export interface IeObjectMediaInfo {
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
