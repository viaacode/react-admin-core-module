import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { AdminConfigManager } from '~core/config';
import type { AdminConfig } from '~core/config/config.types';

import { OptimizedImage, OptimizedImg } from './OptimizedImage';

const ASSET_URL = 'https://assets.example.com/image.jpg';

const resized = (width: number) =>
	`https://proxy.example.com/images/${width}?url=${encodeURIComponent(ASSET_URL)}`;

function setGetImageUrls(getImageUrls?: AdminConfig['services']['getImageUrls']) {
	AdminConfigManager.setConfig({ services: { getImageUrls } } as AdminConfig);
}

afterEach(() => {
	cleanup();
	AdminConfigManager.setConfig(undefined as unknown as AdminConfig);
});

describe('<OptimizedImage />', () => {
	it('renders the avo2 Image markup with the original url without a hook', () => {
		const { container } = render(
			<OptimizedImage src={ASSET_URL} displayWidth={640} alt="test" className="custom" wide />
		);
		expect(container.firstChild).toHaveClass('custom', 'c-image', 'c-image--full');
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', ASSET_URL);
		expect(img).not.toHaveAttribute('srcset');
	});

	it('loads the resized image and falls back to the next url on error', () => {
		setGetImageUrls((url, width) => [resized(width), url]);
		render(<OptimizedImg src={ASSET_URL} displayWidth={640} alt="test" />);
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', resized(640));
		expect(img).toHaveAttribute('srcset', `${resized(640)} 1x, ${resized(1280)} 2x`);

		fireEvent.error(img);
		expect(img).toHaveAttribute('src', ASSET_URL);
		expect(img).not.toHaveAttribute('srcset');

		// No more fallbacks: stays on the last url
		fireEvent.error(img);
		expect(img).toHaveAttribute('src', ASSET_URL);
	});

	it('has no srcset for images shown at their own size', () => {
		setGetImageUrls((url, width) => [resized(width), url]);
		render(<OptimizedImg src={ASSET_URL} displayWidth={1280} intrinsicSize alt="test" />);
		const img = screen.getByRole('img');
		expect(img).toHaveAttribute('src', resized(1280));
		expect(img).not.toHaveAttribute('srcset');
	});

	it('renders nothing without a src', () => {
		const { container } = render(<OptimizedImg src={undefined} displayWidth={640} alt="" />);
		expect(container).toBeEmptyDOMElement();
	});
});
