import { AlignOptions, ButtonAction } from '@viaa/avo2-components';
import React, { FunctionComponent } from 'react';
import { BlockImageGrid } from '~content-blocks/BlockImageGrid/BlockImageGrid';
import { GridItem } from '~content-blocks/BlockImageGrid/BlockImageGrid.types';

export interface BlockUspGridWrapperProps {
	elements: GridItem[];
	textAlign?: AlignOptions;
	className?: string;
	navigate?: (buttonAction: ButtonAction) => void;
}

export const BlockUspGridWrapper: FunctionComponent<BlockUspGridWrapperProps> = ({ ...rest }) => {
	return (
		<div style={{ width: 'calc(100% + 124px)', marginLeft: '-62px' }}>
			<BlockImageGrid
				imageWidth="32.5rem"
				imageHeight="7.5rem"
				itemWidth="32.5rem"
				horizontalMargin={124}
				verticalMargin={82}
				textSize={20}
				textMargin={20}
				textWeight={500}
				fill="contain"
				{...rest}
			/>
		</div>
	);
};
