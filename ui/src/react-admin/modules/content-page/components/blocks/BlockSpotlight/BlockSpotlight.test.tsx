import { cleanup, render } from '@testing-library/react';
import { testRenderLink } from '@viaa/avo2-components';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { action } from '~shared/helpers/action';

import { BlockSpotlight } from './BlockSpotlight';
import { MOCK_SPOTLIGHT_PROJECTS } from './BlockSpotlight.mock';

const BlockSpotlightExample = (
	<BlockSpotlight
		elements={MOCK_SPOTLIGHT_PROJECTS}
		renderLink={testRenderLink(action('Clicked on spotlight item'))}
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockSpotlight />', () => {
	it('Should be able to render', () => {
		render(BlockSpotlightExample);
	});

	it('Should set the correct className', () => {
		const { container } = render(BlockSpotlightExample);
		const mainDiv = container.querySelector('div');
		const projectItems = container.querySelectorAll('.c-spotlight__item');
		expect(mainDiv).toHaveClass('c-spotlight');
		expect(projectItems.length).toBeGreaterThanOrEqual(3);
	});

	it('Should set the correct title', () => {
		const { container } = render(BlockSpotlightExample);
		const titleElement = container.querySelector('p');
		expect(titleElement?.textContent).toEqual('Big item ');
	});
});
