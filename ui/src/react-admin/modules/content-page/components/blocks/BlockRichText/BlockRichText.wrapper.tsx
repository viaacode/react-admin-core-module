import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockRichTextProps } from '~content-blocks/BlockRichText/BlockRichText';
import { BlockRichText } from '~content-blocks/BlockRichText/BlockRichText';

export const BlockRichTextWrapper: FunctionComponent<
	Omit<BlockRichTextProps, 'maxTextWidth'> & {
		limitWidth?: boolean;
	}
> = ({ limitWidth, ...rest }) => {
	return <BlockRichText {...rest} {...(limitWidth ? { maxTextWidth: '800px' } : {})} />;
};
