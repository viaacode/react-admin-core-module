import { AlignOptions, ButtonAction } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';
import { formatLookup } from '~content-blocks/BlockImageGrid/BlockImageGrid.wrapper';
import { BlockImageGrid } from '~content-blocks/BlockImageGrid/BlockImageGrid';
import { CssSizeSetting, GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';

import { BlockGridFormatOption, FillOption } from '~modules/content-page/types/content-block.types';

export interface BlockLogoGridWrapperProps {
	elements: GridItem[];
	format: BlockGridFormatOption;
	itemWidth: CssSizeSetting;
	fill?: FillOption;
	textAlign?: AlignOptions;
	className?: string;
	navigate?: (buttonAction: ButtonAction) => void;
}

export const BlockLogoGridWrapper: FunctionComponent<BlockLogoGridWrapperProps> = ({
	format = '2:1',
	itemWidth = '40rem',
	...rest
}) => {
	return <BlockImageGrid {...formatLookup[format]} itemWidth={itemWidth} {...rest} />;
};
