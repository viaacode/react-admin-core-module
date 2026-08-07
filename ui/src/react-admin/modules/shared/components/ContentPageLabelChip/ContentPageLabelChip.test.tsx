import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { Color } from '~modules/content-page/types/content-block.types';
import { ContentPageLabelChip } from './ContentPageLabelChip';

afterEach(() => {
	cleanup();
});

describe('<ContentPageLabelChip />', () => {
	it('renders the label text so a screen reader can read it', () => {
		render(<ContentPageLabelChip label="Erfgoedverhalen" color={Color.BlossomPink} />);

		expect(screen.getByText('Erfgoedverhalen')).toBeTruthy();
	});

	it('uses the chosen colour as the background', () => {
		const { container } = render(
			<ContentPageLabelChip label="Erfgoedverhalen" color={Color.BlossomPink} />
		);

		const chip = container.querySelector('.c-content-page-label-chip') as HTMLElement;

		expect(chip.style.background).toEqual('rgb(230, 148, 179)');
	});

	it('renders nothing without a label', () => {
		const { container } = render(<ContentPageLabelChip label="" color={Color.Black} />);

		expect(container.querySelector('.c-content-page-label-chip')).toBeNull();
	});
});
