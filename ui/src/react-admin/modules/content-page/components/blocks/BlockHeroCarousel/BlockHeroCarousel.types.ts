import type { Color } from '~modules/content-page/types/content-block.types.ts';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types.ts';
import type { PickerItem } from '~shared/types/content-picker.ts';

export interface HeroCarouselBlockComponentState {
	mediaItem?: PickerItem;
	startCuePoint?: string;
	endCuePoint?: string;
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
	PlayableDisplayIeObject;
