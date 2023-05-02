import { AlignOptions, ButtonAction } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';
import { BlockImageGrid } from '~content-blocks/BlockImageGrid/BlockImageGrid';
import { GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';

import { BlockGridFormatOption, FillOption } from '~modules/content-page/types/content-block.types';

export interface BlockImageGridWrapperProps {
	elements: GridItem[];
	format: BlockGridFormatOption;
	fill?: FillOption;
	textAlign?: AlignOptions;
	className?: string;
	navigate?: (buttonAction: ButtonAction) => void;
}

export const formatLookup: {
	/* eslint-disable @typescript-eslint/no-unused-vars */
	[format in BlockGridFormatOption]: {
		/* eslint-enable @typescript-eslint/no-unused-vars */
		imageWidth: number;
		imageHeight: number;
		itemWidth: number;
	};
} = {
	squareSmall: { imageWidth: 200, imageHeight: 200, itemWidth: 200 },
	squareLarge: { imageWidth: 275, imageHeight: 275, itemWidth: 275 },
	'4:3': { imageWidth: 400, imageHeight: 300, itemWidth: 400 },
	'2:1': { imageWidth: 200, imageHeight: 100, itemWidth: 200 },
	'6:9': { imageWidth: 400, imageHeight: 225, itemWidth: 400 },
	'400x150': { imageWidth: 400, imageHeight: 150, itemWidth: 400 },
	'384x220': { imageWidth: 384, imageHeight: 220, itemWidth: 384 },
};

export const BlockImageGridWrapper: FunctionComponent<BlockImageGridWrapperProps> = ({
	format = 'squareLarge',
	...rest
}) => {
	return <BlockImageGrid {...formatLookup[format]} {...rest} />;
};
