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
	titleAbove?: string;
	title?: string;
	textAbove?: string | ReactNode;
	text?: string | ReactNode;
	buttonLabel?: string;
	buttonType?: ButtonType | string;
	buttonTitle?: string;
	buttonAltTitle?: string;
	action?: ButtonAction;
}

export type CssSizeSetting = `${number}${'rem' | '%'}`;

export interface BlockImageGridProps extends DefaultProps {
	elements: GridItem[];
	imageWidth?: CssSizeSetting;
	imageHeight?: CssSizeSetting;
	itemWidth?: CssSizeSetting;
	fill?: 'cover' | 'contain' | 'auto';
	align?: AlignOptions;
	imageItemAlignment?: AlignOptions;
	textAlign?: AlignOptions;
	textSize?: number;
	textMargin?: number;
	textWeight?: number;
	textColor?: string;
	className?: string;
	horizontalMargin?: number;
	verticalMargin?: number;
	renderLink?: RenderLinkFunction;
}
