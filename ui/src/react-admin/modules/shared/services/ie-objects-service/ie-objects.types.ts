import type { IeObjectType } from '~shared/helpers/map-format-to-type.ts';

export interface PlayableDisplayIeObject {
	schemaIdentifier: string;
	name: string;
	thumbnailUrl: string | null;
	dctermsFormat: IeObjectType;
	maintainerName: string;
	maintainerLogo?: string;
	maintainerOverlay: boolean;
	/** Audio/video objects only: ready-to-play, signed URL for the file to feed directly into a player, or null if none is playable/accessible */
	playableUrl?: string | null;
	/** Audio/video objects only: mime type of the file playableUrl points to, so the client knows how to handle it */
	mimeType?: string | null;
	/** Audio/video objects only: peak/waveform sample data, for audio and audio fragments only - just the sample array, the rest of the peak file's metadata isn't used. Additive data for the waveform overlay, not a substitute for playableUrl */
	peakfileData?: number[] | null;
	/** Non audio/video objects only (e.g. newspapers): self-contained base64 data uri of the IIIF detail image, or null if none is accessible/couldn't be resolved. Use this directly as an <img src> */
	newspaperImage?: string | null;
	snipPoint?: {
		start?: number;
		end?: number;
	};
}

/**
 * One ie-object of a content block as the content page editor passes it to the proxy, in place of
 * a block id it can't use there. Keep one entry per block element, with an empty schemaIdentifier
 * for an element that has no object selected yet, so the response stays aligned with the
 * elements.
 */
export interface UnsavedPlayableDisplayDataObject {
	schemaIdentifier: string;
	start?: number;
	end?: number;
}
