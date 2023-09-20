import { DefaultProps, Quote } from '@viaa/avo2-components';
import clsx from 'clsx';
import React, { FunctionComponent } from 'react';

import './BlockQuote.scss';

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
		authorImage={authorImage}
		authorName={authorName}
		authorInitials={authorInitials}
	/>
);
