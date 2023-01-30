import React, { FunctionComponent } from 'react';
import { BlockCTAs, BlockCTAsProps } from '~content-blocks/BlockCTAs/BlockCTAs';

import { isMobileWidth } from '~shared/helpers/media-query';

export const BlockCTAsWrapper: FunctionComponent<BlockCTAsProps> = (props) => {
	return <BlockCTAs {...props} width={isMobileWidth() ? '100%' : props.width} />;
};
