import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { CopyrightAttribution } from './CopyrightAttribution';

afterEach(() => cleanup());

describe('<CopyrightAttribution />', () => {
	it('marks the annotation as secondary and the attribution text as primary', () => {
		const { container } = render(
			<CopyrightAttribution showIcon text="Collection" title="Photographer" />
		);

		expect(screen.getByText(/Photographer/)).toHaveClass('u-background-text-secondary');
		expect(screen.getByText('Collection')).toHaveClass('u-background-text-primary');
		expect(container.firstChild).toHaveClass('a-copyright-attribution');
	});
});
