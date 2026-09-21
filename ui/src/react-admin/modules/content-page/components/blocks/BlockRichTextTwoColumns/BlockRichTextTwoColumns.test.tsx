import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockRichTextTwoColumns } from './BlockRichTextTwoColumns';
import {
	RICH_TEXT_TWO_COLUMNS_IMAGE_COLUMN_MOCK,
	RICH_TEXT_TWO_COLUMNS_TEXT_COLUMN_MOCK,
} from './BlockRichTextTwoColumns.mock';

const customClass = 'c-block-custom';

const TwoColumnExample = (
	<BlockRichTextTwoColumns
		className={customClass}
		elements={[RICH_TEXT_TWO_COLUMNS_TEXT_COLUMN_MOCK, RICH_TEXT_TWO_COLUMNS_TEXT_COLUMN_MOCK]}
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockRichTextTwoColumns />', () => {
	it('Should be able to render', () => {
		render(TwoColumnExample);
	});

	it('Should render the markdown correctly', () => {
		const { container } = render(TwoColumnExample);
		expect(container.innerHTML).toContain('>Title</h1>');
		expect(container.innerHTML).toContain('<li>one</li>');
	});

	it('Should set the correct className', () => {
		const { container } = render(TwoColumnExample);
		expect(container.firstChild).toHaveClass(customClass);
	});

	it('Should create two columns', () => {
		const { container } = render(TwoColumnExample);
		const columns = container.querySelectorAll('.c-rich-text-editor__content');
		expect(columns.length).toBe(2);
	});

	it('Should render an image column next to a text column', () => {
		const { container } = render(
			<BlockRichTextTwoColumns
				elements={[RICH_TEXT_TWO_COLUMNS_TEXT_COLUMN_MOCK, RICH_TEXT_TWO_COLUMNS_IMAGE_COLUMN_MOCK]}
			/>
		);

		// The text column still renders its markdown
		expect(container.innerHTML).toContain('>Title</h1>');

		const image = container.querySelector('img');
		expect(image).not.toBeNull();
		expect(image).toHaveAttribute('src', RICH_TEXT_TWO_COLUMNS_IMAGE_COLUMN_MOCK.imageSource);
		expect(image).toHaveAttribute('alt', RICH_TEXT_TWO_COLUMNS_IMAGE_COLUMN_MOCK.imageAlt);
		expect(container.querySelector('.c-rich-text-two-columns-block__image')).toHaveClass(
			'c-rich-text-two-columns-block__image--right'
		);
	});
});
