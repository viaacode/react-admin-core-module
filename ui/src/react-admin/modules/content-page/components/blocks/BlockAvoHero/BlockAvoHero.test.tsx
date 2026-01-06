import { cleanup, render } from '@testing-library/react';
import { loremIpsum } from 'lorem-ipsum';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockAvoHero } from './BlockAvoHero';

const customClass = 'c-block-custom';
const title = 'Page title';
const text = loremIpsum({ count: 3 });

const BlockAvoHeroExample = (
	<BlockAvoHero
		className={customClass}
		title={title}
		content={text}
		src={'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'}
		altText={'hero video'}
	/>
);

afterEach(() => {
	cleanup();
});

describe('<BlockAvoHero />', () => {
	it('Should be able to render', () => {
		render(BlockAvoHeroExample);
	});

	it('Should set the correct className', () => {
		const output = render(BlockAvoHeroExample);
		expect(output.container.firstChild).toHaveClass(customClass);
	});
});
