import type { HetArchiefPlayableDisplayIeObject } from '@viaa/avo2-types';
import type {
	Color,
	MediaItemComponentState,
} from '~modules/content-page/types/content-block.types.ts';

/**
 * How the carousel plays its slides by itself:
 * - ON: every slide starts playing and the carousel moves on when it ends, endlessly
 * - FIRST_3: like ON for the first 3 objects, then the carousel moves to the next slide without
 *   starting it and never moves on by itself again
 * - OFF: no slide starts by itself and the carousel never moves on by itself
 * In every mode, a slide the visitor navigates to starts playing.
 */
export enum HeroCarouselAutoplay {
	On = 'ON',
	First3 = 'FIRST_3',
	Off = 'OFF',
}

// Blocks saved before the option existed have no value; they keep the behavior they had then.
export const DEFAULT_HERO_CAROUSEL_AUTOPLAY = HeroCarouselAutoplay.First3;

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
		isAccessible?: boolean;
	};
