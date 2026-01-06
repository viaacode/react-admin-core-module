import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { flowplayerMock } from '../../../../../../__mocks__/flowplayer';

import { BlockVideo } from './BlockVideo';

const customClass = 'c-block-custom';

const blockVideoExampleExample = (
	<BlockVideo className={customClass} flowPlayerProps={flowplayerMock} />
);

afterEach(() => {
	cleanup();
});

describe('<BlockVideo />', () => {
	it('Should be able to render', () => {
		render(blockVideoExampleExample);
	});

	it('Should set the correct className', () => {
		const { container } = render(blockVideoExampleExample);
		const rootDiv = container.querySelector('div');
		expect(rootDiv).toHaveClass(customClass);
		expect(rootDiv).toHaveClass('o-container-vertical');
	});
});
