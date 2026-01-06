import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockImage } from './BlockImage';

const customClass = 'c-block-custom';

const blockImageExample = (
	<BlockImage
		className={customClass}
		imageSource="https://placeholder.com/500x200.jpg"
		imageDescription="image showing the default dimensions on a grey background"
		title="example title"
		text="example text"
		width="400px"
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockImage />', () => {
	it('Should be able to render', () => {
		render(blockImageExample);
	});

	it('Should render the image correctly', () => {
		render(blockImageExample);
		const imgElement = screen.getByRole('img');
		expect(imgElement).toHaveAttribute('src', 'https://placeholder.com/500x200.jpg');
	});

	it('Should set the correct className', () => {
		const output = render(blockImageExample);
		expect(output.container.firstChild).toHaveClass(customClass);
		expect(output.container.firstChild).toHaveClass('o-block-image');
	});

	it('Should set the correct width', () => {
		const output = render(blockImageExample);
		expect(output.container.firstChild).toHaveClass('o-block-image__400px');
	});

	it('Should set the correct title and text', () => {
		render(blockImageExample);
		const titleElement = screen.getByText('© example title');
		const textElement = screen.getByText('example text');
		expect(titleElement).toBeInTheDocument();
		expect(textElement).toBeInTheDocument();
	});
});
