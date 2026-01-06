import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockIFrame } from './BlockIFrame';

afterEach(() => {
	cleanup();
});

describe('<BlockIFrame />', () => {
	it('Should be able to render', () => {
		render(<BlockIFrame title="test" />);
	});

	it('Should correctly set the wrapper `className`', () => {
		const { container } = render(<BlockIFrame title="test" />);
		const aspectRatioWrapper = container.querySelector('div');
		expect(aspectRatioWrapper).toHaveClass('c-aspect-ratio-wrapper');
	});

	it('Should correctly set the wrapper `className` for the aspect ratios', () => {
		const { container: container32 } = render(<BlockIFrame title="test" ratio="3:2" />);
		const { container: container169 } = render(<BlockIFrame title="test" ratio="16:9" />);
		const video32Wrapper = container32.querySelector('div');
		const video169Wrapper = container169.querySelector('div');
		expect(video32Wrapper).toHaveClass('c-aspect-ratio-wrapper--aspect-3-2');
		expect(video169Wrapper).toHaveClass('c-aspect-ratio-wrapper--aspect-16-9');
	});

	it('Should correctly pass on the supported iframe-props', () => {
		const iframeProps = {
			title: 'hello',
			width: 800,
			height: 450,
			margin: 30,
			frameBorder: '0',
			allowFullScreen: true,
			allowTransparency: true,
			seamless: true,
		};
		const { container } = render(<BlockIFrame {...iframeProps} />);
		const iframeElement = container.querySelector('iframe');
		for (const [key, value] of Object.entries(iframeProps)) {
			if (key === 'title' || key === 'width' || key === 'height' || key === 'frameBorder') {
				expect(iframeElement).toHaveAttribute(key, value.toString());
			}
		}
	});
});
