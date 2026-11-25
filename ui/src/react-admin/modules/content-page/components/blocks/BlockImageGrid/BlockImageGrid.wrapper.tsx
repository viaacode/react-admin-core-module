import type { AlignOptions, ButtonAction } from '@viaa/avo2-components';
import clsx from 'clsx';
import { kebabCase } from 'es-toolkit';
import type { FunctionComponent } from 'react';
import React from 'react';
import { BlockImageGrid } from '~content-blocks/BlockImageGrid/BlockImageGrid';
import type { CssSizeSetting, GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';

import type {
	BlockGridFormatOption,
	FillOption,
} from '~modules/content-page/types/content-block.types';

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
		// Width (css px) of a 16:9 image covering the image box: max(width, height * 16 / 9)
		imageDisplayWidth: number;
		itemWidth: CssSizeSetting;
	};
} = {
	// 30% of the page content width (~390px), but the full width of the screen below 992px on
	// hetarchief, where phones load the 2x image
	flex3: { imageWidth: '100%', imageHeight: '22.0rem', imageDisplayWidth: 640, itemWidth: '30%' },
	squareSmall: {
		imageWidth: '20rem',
		imageHeight: '20rem',
		imageDisplayWidth: 356,
		itemWidth: '20rem',
	},
	squareLarge: {
		imageWidth: '27.5rem',
		imageHeight: '27.5rem',
		imageDisplayWidth: 489,
		itemWidth: '27.5rem',
	},
	'4:3': { imageWidth: '40rem', imageHeight: '30rem', imageDisplayWidth: 533, itemWidth: '40rem' },
	'2:1': { imageWidth: '20rem', imageHeight: '10rem', imageDisplayWidth: 200, itemWidth: '20rem' },
	'16:9Small': {
		imageWidth: '30.7rem',
		imageHeight: '17.2rem',
		imageDisplayWidth: 307,
		itemWidth: '30.7rem',
	},
	'6:9': {
		imageWidth: '40rem',
		imageHeight: '22.5rem',
		imageDisplayWidth: 400,
		itemWidth: '40rem',
	},
	'400x150': {
		imageWidth: '40rem',
		imageHeight: '15rem',
		imageDisplayWidth: 400,
		itemWidth: '40rem',
	},
	'384x220': {
		imageWidth: '38.4rem',
		imageHeight: '22rem',
		imageDisplayWidth: 391,
		itemWidth: '38.4rem',
	},
};

export const BlockImageGridWrapper: FunctionComponent<BlockImageGridWrapperProps> = ({
	format = '16:9Small',
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
