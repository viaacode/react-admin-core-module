import type { HetArchiefPlayableDisplayIeObject } from '@viaa/avo2-types';
import type {
	Color,
	MediaItemComponentState,
} from '~modules/content-page/types/content-block.types.ts';

export interface HeroCarouselBlockComponentState extends MediaItemComponentState {
	startTime?: string;
	endTime?: string;
	videoThumbnail?: string;
	backgroundColor?: Color;
}

// While the ie-object data is still loading, we only know the format (it's picked up-front in
// the content picker) -- everything else (thumbnail, name, ...) is filled in once the fetch
// resolves, so those fields stay optional on top of the always-known ones.
export type HeroCarouselSlideItem = Pick<
	HeroCarouselBlockComponentState,
	'videoThumbnail' | 'backgroundColor'
> &
	HetArchiefPlayableDisplayIeObject & {
		/**
		 * Set when the playable-display-data endpoint resolved this slide's object to null: it's
		 * gone, or out of reach for this visitor. The slide then shows an error tile instead of a
		 * player/image.
		 */
		hasFailed?: boolean;
	};
