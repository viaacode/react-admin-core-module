import clsx from 'clsx';
import React, { type FunctionComponent, type ReactElement, useState } from 'react';
import type { TitleWithParallaxBlockComponentState } from '~modules/content-page/types/content-block.types';
import type { DefaultComponentProps } from '~modules/shared/types/components';

import './BlockTitleWithParallax.scss';

export interface BlockTitleWithParallaxProps
	extends TitleWithParallaxBlockComponentState,
		DefaultComponentProps {}

export const BlockTitleWithParallax: FunctionComponent<BlockTitleWithParallaxProps> = ({
	visualType,
	title,
	subtitle,
	image,
}): ReactElement => {
	return <div className={clsx('c-block-title-with-parallax')}></div>;
};
