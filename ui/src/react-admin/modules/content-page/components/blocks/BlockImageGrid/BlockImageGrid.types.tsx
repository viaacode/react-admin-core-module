import {
	AlignOptions,
	ButtonAction,
	ButtonType,
	DefaultProps,
	RenderLinkFunction,
} from '@viaa/avo2-components';
import { ReactNode } from 'react';

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

export interface BlockImageGridProps extends DefaultProps {
	elements: GridItem[];
	imageWidth?: number;
	imageHeight?: number;
	itemWidth?: number;
	fill?: 'cover' | 'contain' | 'auto';
	align?: AlignOptions;
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
