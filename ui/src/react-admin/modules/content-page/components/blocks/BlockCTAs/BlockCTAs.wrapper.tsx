import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockCTAsProps } from '~content-blocks/BlockCTAs/BlockCTAs';
import { BlockCTAs } from '~content-blocks/BlockCTAs/BlockCTAs';

import { isMobileWidth } from '~shared/helpers/media-query';

export const BlockCTAsWrapper: FunctionComponent<BlockCTAsProps> = (props) => {
	return <BlockCTAs {...props} width={isMobileWidth() ? '100%' : props.width} />;
};
