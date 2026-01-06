import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockRichText } from './BlockRichText';
import { RICH_TEXT_MOCK } from './BlockRichText.mock';

const customClass = 'c-block-custom';

const SingleColumnExample = <BlockRichText className={customClass} elements={RICH_TEXT_MOCK} />;
const TwoColumnExample = (
	<BlockRichText className={customClass} elements={[RICH_TEXT_MOCK, RICH_TEXT_MOCK]} />
);

afterEach(() => {
	cleanup();
});

describe('<BlockRichText />', () => {
	it('Should be able to render', () => {
		render(SingleColumnExample);
	});

	it('Should render the markdown correctly', () => {
		const { container } = render(SingleColumnExample);
		expect(container.innerHTML).toContain('>Title</h1>');
		expect(container.innerHTML).toContain('<p>');
		expect(container.innerHTML).toContain('<ul>');
		expect(container.innerHTML).toContain('<li>one</li>');
		expect(container.innerHTML).toContain('<li>two</li>');
		expect(container.innerHTML).toContain('<li>three</li>');
		expect(container.innerHTML).toContain('<li>1</li>');
		expect(container.innerHTML).toContain('<li>2</li>');
		expect(container.innerHTML).toContain('<li>3</li>');
	});

	it('Should set the correct className', () => {
		const { container } = render(SingleColumnExample);
		const contentContainer = container.querySelector('.c-content');
		expect(container.firstChild).toHaveClass(customClass);
		expect(contentContainer).not.toBeNull();
	});

	it('Should create multiple columns', () => {
		const { container } = render(TwoColumnExample);
		const columns = container.querySelectorAll('.c-content');
		expect(columns.length).toBe(2);
	});
});
