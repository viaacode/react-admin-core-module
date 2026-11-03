import type {
	AlignOptions,
	ButtonAction,
	ButtonType,
	DefaultProps,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import type { ReactNode } from 'react';

export interface GridItem {
	source: string;
	copyrightTitle?: string;
	copyrightIconVisible?: boolean;
	copyrightText?: string;
	titleAbove?: string;
	title?: string;
	textAbove?: string | ReactNode;
	text?: string | ReactNode;
	buttonLabel?: string;
	buttonType?: ButtonType | string;
	buttonTitle?: string;
	buttonAltTitle?: string;
	action?: ButtonAction;
	// Visual label drawn in the top left corner of the image
	// https://meemoo.atlassian.net/browse/ARC-3818
	imageLabel?: { text: string; color: string };
}

export type CssSizeSetting = `${number}${'rem' | '%'}`;

export interface BlockImageGridProps extends DefaultProps {
	elements: GridItem[];
	imageWidth?: CssSizeSetting;
	imageHeight?: CssSizeSetting;
	// Width (css px) the image is shown at, to load a resized version of it. With fill: cover a
	// landscape (16:9) photo is wider than its box when the box is not as wide as 16:9.
	imageDisplayWidth?: number;
	itemWidth?: CssSizeSetting;
	fill?: 'cover' | 'contain' | 'auto';
	align?: AlignOptions;
	imageItemAlignment?: AlignOptions;
	textAlign?: AlignOptions;
	textSize?: number;
	textMargin?: number;
	textWeight?: number;
	className?: string;
	horizontalMargin?: number;
	verticalMargin?: number;
	renderLink?: RenderLinkFunction;
}
