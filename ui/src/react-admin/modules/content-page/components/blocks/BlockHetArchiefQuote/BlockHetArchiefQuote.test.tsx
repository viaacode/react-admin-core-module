import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { Color } from '../../../types/content-block.types';
import { BlockHetArchiefQuote } from './BlockHetArchiefQuote';

afterEach(() => {
	cleanup();
});

describe('<BlockHetArchiefQuote />', () => {
	it('renders the quote and the author', () => {
		render(
			<BlockHetArchiefQuote
				quote="Een citaat"
				authorName="John Doe"
				textColor={Color.White}
				frameColor={Color.Black}
			/>
		);

		expect(screen.getByText('Een citaat')).toBeTruthy();
		expect(screen.getByText('John Doe')).toBeTruthy();
	});

	it('exposes the chosen colours as custom properties', () => {
		const { container } = render(
			<BlockHetArchiefQuote
				quote="Een citaat"
				authorName="John Doe"
				textColor={Color.White}
				frameColor={Color.OceanGreen}
			/>
		);

		const figure = container.querySelector('.c-block-het-archief-quote') as HTMLElement;

		expect(figure.style.getPropertyValue('--text-color')).toEqual(Color.White);
		expect(figure.style.getPropertyValue('--frame-color')).toEqual(Color.OceanGreen);
	});

	it('omits the caption when there is no author', () => {
		const { container } = render(
			<BlockHetArchiefQuote quote="Een citaat" textColor={Color.White} frameColor={Color.Black} />
		);

		expect(container.querySelector('figcaption')).toBeNull();
	});

	it('renders the quote mark as the ligature icon name, hidden from assistive tech', () => {
		const { container } = render(
			<BlockHetArchiefQuote quote="Een citaat" textColor={Color.White} frameColor={Color.Black} />
		);

		const mark = container.querySelector('.c-block-het-archief-quote__mark');

		expect(mark?.textContent).toEqual('quotes');
		expect(mark?.getAttribute('aria-hidden')).toEqual('true');
	});
});
