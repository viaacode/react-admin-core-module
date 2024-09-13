import type { AlignOptions, ButtonAction } from '@viaa/avo2-components';
import clsx from 'clsx';
import { kebabCase } from 'lodash-es';
import type { FunctionComponent } from 'react';
import React from 'react';
import { BlockImageGrid } from '~content-blocks/BlockImageGrid/BlockImageGrid';
import type { CssSizeSetting, GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';

import type { BlockGridFormatOption, FillOption } from '~modules/content-page/types/content-block.types';

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
		imageWidth: CssSizeSetting;
		imageHeight: CssSizeSetting;
		itemWidth: CssSizeSetting;
	};
} = {
	flex3: { imageWidth: '100%', imageHeight: '22.0rem', itemWidth: '30%' },
	squareSmall: { imageWidth: '20rem', imageHeight: '20rem', itemWidth: '20rem' },
	squareLarge: { imageWidth: '27.5rem', imageHeight: '27.5rem', itemWidth: '27.5rem' },
	'4:3': { imageWidth: '40rem', imageHeight: '30rem', itemWidth: '40rem' },
	'2:1': { imageWidth: '20rem', imageHeight: '10rem', itemWidth: '20rem' },
	'6:9': { imageWidth: '40rem', imageHeight: '22.5rem', itemWidth: '40rem' },
	'400x150': { imageWidth: '40rem', imageHeight: '15rem', itemWidth: '40rem' },
	'384x220': { imageWidth: '38.4rem', imageHeight: '22rem', itemWidth: '38.4rem' },
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
