import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, it } from 'vitest';

import { BlockUitgeklaard } from './BlockUitgeklaard';

const BlockUitgeklaardExample = (
	<BlockUitgeklaard date="2016-07-13T18:46:01.933Z" titles={['Dit is een leuke titel']} />
);

afterEach(() => {
	cleanup();
});

describe('<BlockUitgeklaard />', () => {
	it('Should be able to render', () => {
		render(BlockUitgeklaardExample);
	});
});
