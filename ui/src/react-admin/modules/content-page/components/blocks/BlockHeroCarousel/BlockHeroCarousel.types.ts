import type { PickerItem } from '~shared/types/content-picker.ts';

export interface HeroCarouselBlockComponentState {
	mediaItem?: PickerItem;
	startCuePoint?: string;
	endCuePoint?: string;
	videoThumbnail?: string;
}
