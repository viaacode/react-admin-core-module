import type { ButtonAction } from '@viaa/avo2-components';
import type { DefaultComponentProps } from '~shared/types';

/**
 * One of the two mirrored halves of the double banner.
 * The FA requires every field except the icons to be filled in.
 * https://meemoo.atlassian.net/browse/ARC-3833
 */
export interface DoubleBannerHalf {
	label: string;
	icon1?: string;
	icon2?: string;
	icon3?: string;
	link: ButtonAction;
	image: string;
	textColor: string;
	backgroundColor: string;
}

export interface BlockDoubleBannerProps extends DefaultComponentProps {
	halves: [DoubleBannerHalf, DoubleBannerHalf];
}
