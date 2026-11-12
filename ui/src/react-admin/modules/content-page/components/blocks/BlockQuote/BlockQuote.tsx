import type { DefaultProps } from '@viaa/avo2-components';
import { Quote } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';
import { getPrimaryImageUrl } from '~shared/helpers/images';

import './BlockQuote.scss';

// The avatar is a 4.8rem circle, loaded at 2x since it is a single url
const AUTHOR_IMAGE_DISPLAY_WIDTH = 96;

export interface BlockQuoteProps extends DefaultProps {
	quote: string;
	authorImage?: string;
	authorName: string;
	authorInitials?: string;
}

export const BlockQuote: FunctionComponent<BlockQuoteProps> = ({
	className,
	quote,
	authorImage,
	authorName,
	authorInitials,
}) => (
	<Quote
		className={clsx('c-block-quote', className)}
		quote={quote}
		authorImage={getPrimaryImageUrl(authorImage, AUTHOR_IMAGE_DISPLAY_WIDTH)}
		authorName={authorName}
		authorInitials={authorInitials}
	/>
);
