import { GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options.ts';
import type { Color } from '~modules/content-page/types/content-block.types';

/**
 * Picks one of the tertiary brand colors at random. Used for tiles that have no image of their own
 * and get a colored background instead.
 */
export const getRandomTertiaryBackgroundColor = (): Color => {
	const tertiaryColors = GET_SECONDARY_BACKGROUND_COLOR_OPTIONS_ARCHIEF();
	// eslint-disable-next-line react-hooks/purity
	return tertiaryColors[Math.floor(Math.random() * tertiaryColors.length)].value as Color;
};
