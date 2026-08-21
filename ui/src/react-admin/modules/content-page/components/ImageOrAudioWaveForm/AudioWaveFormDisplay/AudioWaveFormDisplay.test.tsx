import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Color } from '~modules/content-page/types/content-block.types.ts';
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

	it('should default the wave color to white', () => {
		const { container } = render(<AudioWaveFormDisplay />);
		const outer = container.querySelector('.c-audio-wave-form-display') as HTMLElement;

		expect(outer.style.getPropertyValue('--c-audio-wave-form-display-wave-color')).toBe(
			Color.White
		);
	});

	it('should pass the given wave and background colors through as CSS variables', () => {
		const { container } = render(
			<AudioWaveFormDisplay waveColor={Color.Teal} backgroundColor={Color.NightBlue} />
		);
		const outer = container.querySelector('.c-audio-wave-form-display') as HTMLElement;

		expect(outer.style.getPropertyValue('--c-audio-wave-form-display-wave-color')).toBe(
			Color.Teal
		);
		expect(outer.style.getPropertyValue('--c-audio-wave-form-display-bg')).toBe(
			Color.NightBlue
		);
	});

	it('should pass the given className through', () => {
		const { container } = render(<AudioWaveFormDisplay className="my-extra-class" />);

		expect(container.querySelector('.c-audio-wave-form-display.my-extra-class')).not.toBeNull();
	});
});
