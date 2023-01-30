import React, { FunctionComponent } from 'react';
import { BlockRichText, BlockRichTextProps } from '~content-blocks/BlockRichText/BlockRichText';

export const BlockRichTextWrapper: FunctionComponent<
	Omit<BlockRichTextProps, 'maxTextWidth'> & {
		limitWidth?: boolean;
	}
> = ({ limitWidth, ...rest }) => {
	return <BlockRichText {...rest} {...(limitWidth ? { maxTextWidth: '800px' } : {})} />;
};
