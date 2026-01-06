import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { loremIpsum } from 'lorem-ipsum';
import React, { cloneElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BlockImageTitleTextButton } from './BlockImageTitleTextButton';

const customClass = 'c-block-custom';

const loremIpsumText = loremIpsum({ count: 10 });

const blockImageTitleTextButtonExample = (
	<BlockImageTitleTextButton
		className={customClass}
		imageSource="https://placeholder.com/1280x720.jpg"
		imageDescription="image showing the default dimensions on a grey background"
		title="Title"
		text={loremIpsumText}
		buttonLabel="Goto video"
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockImageTitleTextButton />', () => {
	it('Should be able to render', () => {
		render(blockImageTitleTextButtonExample);
		// If no error is thrown, render is successful
	});

	it('Should render the image correctly', () => {
		render(blockImageTitleTextButtonExample);
		const imgElement = screen.getByRole('img');
		expect(imgElement).toHaveAttribute('src', 'https://placeholder.com/1280x720.jpg');
	});

	it('Should render the title correctly', () => {
		render(blockImageTitleTextButtonExample);
		const h2Element = screen.getByRole('heading', { level: 2 });
		expect(h2Element).toHaveTextContent('Title');
	});

	it('Should render the text correctly', () => {
		render(blockImageTitleTextButtonExample);
		const pElement = screen.getByText(loremIpsumText);
		expect(pElement).toBeInTheDocument();
	});

	it('Should set the correct className', () => {
		const output = render(blockImageTitleTextButtonExample);
		expect(output.container.firstChild).toHaveClass(customClass);
		expect(output.container.firstChild).toHaveClass('o-container-vertical');
	});

	it('Should trigger handler when button is clicked', () => {
		const onButtonClick = vi.fn();
		const elementWithHandler = cloneElement(blockImageTitleTextButtonExample, {
			onClick: onButtonClick,
		});
		render(elementWithHandler);
		const buttonElement = screen.getByRole('button');
		fireEvent.click(buttonElement);
		expect(onButtonClick).toHaveBeenCalled();
		expect(onButtonClick).toHaveBeenCalledTimes(1);
	});
});
