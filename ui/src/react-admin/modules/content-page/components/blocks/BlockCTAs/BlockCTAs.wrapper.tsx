import type { FunctionComponent } from 'react';
import React from 'react';
import type { BlockCTAsProps } from '~content-blocks/BlockCTAs/BlockCTAs';
import { BlockCTAs } from '~content-blocks/BlockCTAs/BlockCTAs';

import { useIsMobileWidth } from '~shared/helpers/media-query';

export const BlockCTAsWrapper: FunctionComponent<BlockCTAsProps> = (props) => {
	const isMobile = useIsMobileWidth();
	return <BlockCTAs {...props} width={isMobile ? '100%' : props.width} />;
};
