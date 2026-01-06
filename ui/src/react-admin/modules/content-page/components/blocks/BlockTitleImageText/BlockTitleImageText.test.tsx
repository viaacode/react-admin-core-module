import { cleanup, render, screen } from '@testing-library/react';
import { loremIpsum } from 'lorem-ipsum';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockTitleImageText } from './BlockTitleImageText';

const customClass = 'c-block-custom';

const loremIpsumText = loremIpsum({ count: 10 });

const blockTitleImageTextExample = (
	<BlockTitleImageText
		className={customClass}
		imageSource="https://placeholder.com/500x200.jpg"
		imageDescription="image showing the default dimensions on a grey background"
		title="Title"
		text={loremIpsumText}
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockTitleImageText />', () => {
	it('Should be able to render', () => {
		render(blockTitleImageTextExample);
	});

	it('Should render the thumbnail slot correctly', () => {
		render(blockTitleImageTextExample);
		const imgElement = screen.getByRole('img');
		expect(imgElement).toHaveAttribute('src', 'https://placeholder.com/500x200.jpg');
	});

	it('Should render the text slot correctly', () => {
		render(blockTitleImageTextExample);
		const h2Element = screen.getByRole('heading', { level: 2 });
		expect(h2Element).toHaveTextContent('Title');
	});
});
