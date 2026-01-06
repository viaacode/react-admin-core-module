import { cleanup, render } from '@testing-library/react';
import { loremIpsum } from 'lorem-ipsum';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockIntro } from './BlockIntro';

const customClass = 'c-block-custom';
const title = 'Page title';
const text = loremIpsum({ count: 3 });

const BlockIntroExample = <BlockIntro className={customClass} title={title} content={text} />;

afterEach(() => {
	cleanup();
});

describe('<BlockIntro />', () => {
	it('Should be able to render', () => {
		render(BlockIntroExample);
	});

	it('Should set the correct className', () => {
		const output = render(BlockIntroExample);
		expect(output.container.firstChild).toHaveClass(customClass);
		expect(output.container.firstChild).toHaveClass('c-content');
		expect(output.container.firstChild).toHaveClass('u-text-left');
		expect(output.container.firstChild?.childNodes[0]).toHaveClass(
			'o-container-vertical-title__title'
		);
		expect(output.container.firstChild?.childNodes[1]).toHaveClass(
			'o-container-vertical-intro__intro'
		);
	});
});
