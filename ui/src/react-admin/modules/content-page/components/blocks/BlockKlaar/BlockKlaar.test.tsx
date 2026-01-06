import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, it } from 'vitest';

import { BlockKlaar } from './BlockKlaar';

const BlockKlaarExample = (
	<BlockKlaar date="2016-07-13T18:46:01.933Z" titles={['Dit is een leuke titel']} />
);

afterEach(() => {
	cleanup();
});

describe('<BlockKlaar />', () => {
	it('Should be able to render', () => {
		render(BlockKlaarExample);
	});
});
