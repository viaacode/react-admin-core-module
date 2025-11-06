import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockCTAsProps } from '~content-blocks/BlockCTAs/BlockCTAs.js';
import { BlockCTAs } from '~content-blocks/BlockCTAs/BlockCTAs.js';

import { isMobileWidth } from '~shared/helpers/media-query.js';

export const BlockCTAsWrapper: FunctionComponent<BlockCTAsProps> = (props) => {
	return <BlockCTAs {...props} width={isMobileWidth() ? '100%' : props.width} />;
};
