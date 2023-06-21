import { AlignOptions, ButtonAction } from '@viaa/avo2-components';
import clsx from 'clsx';
import { kebabCase } from 'lodash-es';
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
		imageWidth: string;
		imageHeight: string;
		itemWidth: string;
	};
} = {
	flex3: { imageWidth: '100%', imageHeight: '220px', itemWidth: '30%' },
	squareSmall: { imageWidth: '200px', imageHeight: '200px', itemWidth: '200px' },
	squareLarge: { imageWidth: '275px', imageHeight: '275px', itemWidth: '275px' },
	'4:3': { imageWidth: '400px', imageHeight: '300px', itemWidth: '400px' },
	'2:1': { imageWidth: '200px', imageHeight: '100px', itemWidth: '200px' },
	'6:9': { imageWidth: '400px', imageHeight: '225px', itemWidth: '400px' },
	'400x150': { imageWidth: '400px', imageHeight: '150px', itemWidth: '400px' },
	'384x220': { imageWidth: '384px', imageHeight: '220px', itemWidth: '384px' },
};

export const BlockImageGridWrapper: FunctionComponent<BlockImageGridWrapperProps> = ({
	format = 'squareLarge',
	...rest
}) => {
	return (
		<BlockImageGrid
			{...formatLookup[format]}
			{...rest}
			className={clsx(`c-block-grid--${kebabCase(format)}`, rest.className)}
		/>
	);
};
