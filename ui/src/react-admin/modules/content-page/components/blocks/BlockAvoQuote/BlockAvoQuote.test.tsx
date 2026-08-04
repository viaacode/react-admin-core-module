import { cleanup, render } from '@testing-library/react';
import { loremIpsum } from 'lorem-ipsum';
import React from 'react';
import { afterEach, describe, it } from 'vitest';

import { BlockAvoQuote } from './BlockAvoQuote';

const customClass = 'c-block-custom';
const quote = loremIpsum({ count: 10 });
const authorImage = 'https://placeholder.com/500x200.jpg';
const authorName = loremIpsum({ count: 2 });
const authorInitials = 'AE';

const quoteExample = (
	<BlockAvoQuote
		className={customClass}
		quote={quote}
		authorImage={authorImage}
		authorName={authorName}
		authorInitials={authorInitials}
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockAvoQuote />', () => {
	it('Should be able to render', () => {
		render(quoteExample);
	});
});
