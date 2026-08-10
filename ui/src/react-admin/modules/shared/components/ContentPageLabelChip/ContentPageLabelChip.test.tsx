import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { Color, CustomBackground } from '~modules/content-page/types/content-block.types';
import { ContentPageLabelChip } from './ContentPageLabelChip';

afterEach(() => {
	cleanup();
});

const renderChip = (color: string): HTMLElement => {
	const { container } = render(<ContentPageLabelChip label="Erfgoedverhalen" color={color} />);

	return container.querySelector('.c-content-page-label-chip') as HTMLElement;
};

describe('<ContentPageLabelChip />', () => {
	it('renders the label text so a screen reader can read it', () => {
		render(<ContentPageLabelChip label="Erfgoedverhalen" color={Color.BlossomPink} />);

		expect(screen.getByText('Erfgoedverhalen')).toBeTruthy();
	});

	it('uses the chosen colour as the background', () => {
		expect(renderChip(Color.BlossomPink).style.background).toEqual('rgb(230, 148, 179)');
	});

	it('renders the meemoo logo background as transparent, since a chip cannot show the pattern', () => {
		// jsdom drops the uppercase TRANSPARENT keyword, so this asserts that the placeholder itself
		// never reaches the style attribute. Browsers do accept it, css keywords are case insensitive
		expect(renderChip(CustomBackground.MeemooLogo).style.background).not.toContain('MEEMOO_LOGO');
	});

	it('writes black on the colours that white text fails wcag aa on', () => {
		expect(renderChip(Color.BlossomPink).style.color).toEqual('rgb(0, 0, 0)');
	});

	it('writes white on the colours that white text passes wcag aa on', () => {
		expect(renderChip(Color.Black).style.color).toEqual('rgb(255, 255, 255)');
		expect(renderChip(Color.OldPink).style.color).toEqual('rgb(255, 255, 255)');
	});

	it('renders nothing without a label', () => {
		const { container } = render(<ContentPageLabelChip label="" color={Color.Black} />);

		expect(container.querySelector('.c-content-page-label-chip')).toBeNull();
	});
});
