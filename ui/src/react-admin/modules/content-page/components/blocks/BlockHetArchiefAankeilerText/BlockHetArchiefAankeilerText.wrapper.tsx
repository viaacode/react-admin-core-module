import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockHetArchiefAankeilerTextProps } from '~content-blocks/BlockHetArchiefAankeilerText/BlockHetArchiefAankeilerText';
import { BlockHetArchiefAankeilerText } from '~content-blocks/BlockHetArchiefAankeilerText/BlockHetArchiefAankeilerText';

export const BlockHetArchiefAankeilerTextWrapper: FunctionComponent<
	Omit<BlockHetArchiefAankeilerTextProps, 'maxTextWidth'> & {
		limitWidth?: boolean;
	}
> = ({ limitWidth, ...rest }) => {
	return (
		<BlockHetArchiefAankeilerText {...rest} {...(limitWidth ? { maxTextWidth: '800px' } : {})} />
	);
};
