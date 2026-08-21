import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { AudioWaveFormDisplay } from './AudioWaveFormDisplay';

afterEach(() => {
	cleanup();
});

describe('<AudioWaveFormDisplay />', () => {
	it('should be able to render', () => {
		render(<AudioWaveFormDisplay />);
	});

	it('should render the large size with twice as many bars as the small size', () => {
		const { container: small } = render(<AudioWaveFormDisplay size="small" />);
		const { container: large } = render(<AudioWaveFormDisplay size="large" />);

		const smallBarCount = small.querySelectorAll('.c-audio-wave-form-display__bar').length;
		const largeBarCount = large.querySelectorAll('.c-audio-wave-form-display__bar').length;

		expect(largeBarCount).toBe(smallBarCount * 2);
	});

	it('should only color bars up to the given highlight percentage', () => {
		const { container } = render(
			<AudioWaveFormDisplay highlightColor="#ff0000" highlightPercentage={50} />
		);
		const bars = container.querySelectorAll('.c-audio-wave-form-display__bar');

		const highlightedCount = Array.from(bars).filter(
			(bar) => (bar as HTMLElement).style.getPropertyValue('--c-audio-wave-form-display-bar-color')
		).length;

		expect(highlightedCount).toBe(Math.round(bars.length / 2));
	});

	it('should not color any bar when no highlight color is given', () => {
		const { container } = render(<AudioWaveFormDisplay highlightPercentage={100} />);
		const bars = container.querySelectorAll('.c-audio-wave-form-display__bar');

		bars.forEach((bar) => {
			expect(
				(bar as HTMLElement).style.getPropertyValue('--c-audio-wave-form-display-bar-color')
			).toBe('');
		});
	});

	it('should pass the given className through', () => {
		const { container } = render(<AudioWaveFormDisplay className="my-extra-class" />);

		expect(container.querySelector('.c-audio-wave-form-display.my-extra-class')).not.toBeNull();
	});
});
