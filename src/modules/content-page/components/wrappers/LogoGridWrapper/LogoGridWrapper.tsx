import { AlignOptions, BlockImageGrid, ButtonAction, GridItem } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';

import { formatLookup } from '../ImageGridWrapper/ImageGridWrapper';

import { BlockGridFormatOption, FillOption } from 'modules/content-page/types/content-block.types';

export interface BlockLogoGridWrapperProps {
	elements: GridItem[];
	format: BlockGridFormatOption;
	itemWidth: number;
	fill?: FillOption;
	textAlign?: AlignOptions;
	className?: string;
	navigate?: (buttonAction: ButtonAction) => void;
}

const BlockLogoGridWrapper: FunctionComponent<BlockLogoGridWrapperProps> = ({
	format = '2:1',
	itemWidth = 400,
	...rest
}) => {
	return <BlockImageGrid {...formatLookup[format]} itemWidth={itemWidth} {...rest} />;
};

export default BlockLogoGridWrapper;
