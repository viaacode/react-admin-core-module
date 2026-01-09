import { cleanup, render, screen } from '@testing-library/react';
import { loremIpsum } from 'lorem-ipsum';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { flowplayerMock } from '../../../../../../__mocks__/flowplayer';

import { BlockVideoTitleTextButton } from './BlockVideoTitleTextButton';

const customClass = 'c-block-custom';
const loremIpsumText = loremIpsum({ count: 10 });

const titleLink = 'http://google.com?q=title';
const blockVideoTitleTextButtonExample = (
	<BlockVideoTitleTextButton
		className={customClass}
		flowPlayerProps={flowplayerMock}
		title="Title"
		titleLink={titleLink}
		text={loremIpsumText}
	/>
);

afterEach(() => {
	cleanup();
});

// Mock FlowPlayer
vi.mock('@meemoo/react-components', async () => {
	// biome-ignore lint/suspicious/noExplicitAny: This is a test, we don't want to type out all props
	const actual = await vi.importActual<any>('@meemoo/react-components');
	return {
		...actual,
		// biome-ignore lint/suspicious/noExplicitAny: This is a test, we don't want to type out all props
		FlowPlayer: (props: any) => (
			<div data-testid="flowplayer-mock">
				{/* optionally expose something for assertions */}
				{props?.title ? <div data-testid="flowplayer-title">{props.title}</div> : null}
			</div>
		),
	};
});

describe('<BlockVideoTitleTextButton />', () => {
	it('Should be able to render', () => {
		render(blockVideoTitleTextButtonExample);
	});

	it('Should render the title correctly', () => {
		render(blockVideoTitleTextButtonExample);
		const h2Element = screen.getByRole('heading', { level: 2, hidden: true });
		expect(h2Element).toHaveTextContent('Title');
	});

	it('Should render the title link correctly', () => {
		render(blockVideoTitleTextButtonExample);
		const anchorElement = screen.getByRole('link', { name: 'Title', hidden: true });
		expect(anchorElement).toHaveAttribute('href', titleLink);
	});

	it('Should render the text correctly', () => {
		render(blockVideoTitleTextButtonExample);
		const pElement = screen.getByText(loremIpsumText);
		expect(pElement).toBeInTheDocument();
	});
});
