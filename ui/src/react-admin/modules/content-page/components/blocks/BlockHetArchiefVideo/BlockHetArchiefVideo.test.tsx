import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockHetArchiefVideo } from './BlockHetArchiefVideo';

const customClass = 'c-block-custom';

const blockHetArchiefVideoExample = (
	<BlockHetArchiefVideo className={customClass} flowPlayerWrapperProps={{ trackPlayEvent: true }} />
);

afterEach(() => {
	cleanup();
});

describe('<BlockHetArchiefVideo />', () => {
	it('Should be able to render', () => {
		render(blockHetArchiefVideoExample);
	});

	it('Should set the correct className', () => {
		const { container } = render(blockHetArchiefVideoExample);
		const rootDiv = container.querySelector('div');
		expect(rootDiv).toHaveClass(customClass);
		expect(rootDiv).toHaveClass('o-container-vertical');
	});
});
