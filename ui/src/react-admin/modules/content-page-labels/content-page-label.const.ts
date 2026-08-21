import { Color, CustomBackground } from '~modules/content-page/types/content-block.types';

export const LABELS_PER_PAGE = 10;

// These backgrounds do not distinguish a label preview from a white admin page without a border.
// The meemoo logo is included because ContentPageLabelChip renders it as transparent.
export const CONTENT_PAGE_LABEL_COLORS_INVISIBLE_ON_WHITE: string[] = [
	Color.Transparent,
	Color.White,
	Color.Platinum,
	CustomBackground.MeemooLogo,
];
