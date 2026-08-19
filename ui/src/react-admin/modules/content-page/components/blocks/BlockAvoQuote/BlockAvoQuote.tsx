import type { DefaultProps } from '@viaa/avo2-components';
import { Quote } from '@viaa/avo2-components';
import clsx from 'clsx';
import type { FunctionComponent } from 'react';
import React from 'react';

import './BlockAvoQuote.scss';

export interface BlockAvoQuoteProps extends DefaultProps {
	quote: string;
	authorImage?: string;
	authorName: string;
	authorInitials?: string;
}

export const BlockAvoQuote: FunctionComponent<BlockAvoQuoteProps> = ({
	className,
	quote,
	authorImage,
	authorName,
	authorInitials,
}) => (
	<Quote
		className={clsx('c-block-quote', className)}
		quote={quote}
		authorImage={authorImage}
		authorName={authorName}
		authorInitials={authorInitials}
	/>
);
