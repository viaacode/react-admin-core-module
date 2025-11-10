import { mount, shallow } from 'enzyme';
import { loremIpsum } from 'lorem-ipsum';
import React from 'react';

import { BlockAvoHero } from './BlockAvoHero.js';

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

describe('<BlockAvoHero />', () => {
	it('Should be able to render', () => {
		shallow(BlockAvoHeroExample);
	});

	it('Should set the correct className', () => {
		const component = mount(BlockAvoHeroExample);
		expect(component.hasClass(customClass)).toEqual(true);
	});
});
