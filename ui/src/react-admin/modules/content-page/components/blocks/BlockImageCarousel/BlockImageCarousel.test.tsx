import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

import { BlockImageCarousel } from './BlockImageCarousel';

// jsdom has no ResizeObserver; BlockImageCarouselSlide only needs observe()/disconnect() to exist.
beforeAll(() => {
	// biome-ignore lint/suspicious/noExplicitAny: minimal jsdom stub
	(global as any).ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
});

afterEach(() => {
	cleanup();
});

const copyright = { copyrightTitle: '', copyrightText: '', copyrightIconVisible: false };
const elements = [
	{ image: 'https://example.com/a.jpg', imageAlt: 'a', ...copyright },
	{ image: 'https://example.com/b.jpg', imageAlt: 'b', ...copyright },
	{ image: 'https://example.com/c.jpg', imageAlt: 'c', ...copyright },
];

describe('<BlockImageCarousel />', () => {
	it('should be able to render', () => {
		render(<BlockImageCarousel title="Title" titleType="h2" elements={elements} />);
	});

	it('should render one .swiper-slide per element', () => {
		const { container } = render(
			<BlockImageCarousel title="Title" titleType="h2" elements={elements} />
		);
		expect(container.querySelectorAll('.swiper-slide')).toHaveLength(elements.length);
	});

	it('should let swiper/react recognize each slide (regression: SwiperSlide must be a direct child of Swiper, not returned by a wrapping component)', () => {
		// swiper/react's <SwiperSlide> stamps a `swiperSlideIndex` JS property (not an HTML
		// attribute) onto its DOM node once swiper/react's own child scan recognizes it as a
		// real slide. If a wrapping component returns <SwiperSlide> instead of it being a direct
		// JSX child of <Swiper>, that scan finds zero slides, and every slide silently falls back
		// to a plain, unpositioned DOM node instead (no sliding, no navigation) -- this is exactly
		// what this test guards against.
		const { container } = render(
			<BlockImageCarousel title="Title" titleType="h2" elements={elements} />
		);
		const slides = container.querySelectorAll('.swiper-slide');
		expect(slides.length).toBeGreaterThan(0);
		slides.forEach((slide) => {
			expect((slide as unknown as { swiperSlideIndex?: number }).swiperSlideIndex).toBeTypeOf(
				'number'
			);
		});
	});
});
