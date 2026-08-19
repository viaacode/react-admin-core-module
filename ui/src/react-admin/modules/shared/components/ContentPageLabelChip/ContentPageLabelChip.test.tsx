import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Color, CustomBackground } from '~modules/content-page/types/content-block.types';
import { ContentPageLabelChip } from './ContentPageLabelChip';

vi.mock('~shared/helpers/is-avo', () => ({ isAvo: () => false }));

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

	it('uses the shared WCAG text colour for the chosen background', () => {
		expect(renderChip(Color.White).style.color).toEqual('rgb(0, 0, 0)');
		expect(renderChip(Color.SandBeige).style.color).toEqual('rgb(0, 0, 0)');
		expect(renderChip(Color.Black).style.color).toEqual('rgb(255, 255, 255)');
	});

	it('keeps white text when the background has no WCAG mapping', () => {
		expect(renderChip(CustomBackground.MeemooLogo).style.color).toEqual('rgb(255, 255, 255)');
	});

	it('renders the meemoo logo background as transparent, since a chip cannot show the pattern', () => {
		// jsdom drops the uppercase TRANSPARENT keyword, so this asserts that the placeholder itself
		// never reaches the style attribute. Browsers do accept it, css keywords are case insensitive
		expect(renderChip(CustomBackground.MeemooLogo).style.background).not.toContain('MEEMOO_LOGO');
	});

	it('adds the bordered variant only when requested by the surrounding context', () => {
		const { container } = render(
			<ContentPageLabelChip label="Erfgoedverhalen" color={Color.White} bordered />
		);

		expect(
			container
				.querySelector('.c-content-page-label-chip')
				?.classList.contains('c-content-page-label-chip--bordered')
		).toBe(true);
		expect(renderChip(Color.White).classList.contains('c-content-page-label-chip--bordered')).toBe(
			false
		);
	});

	it('renders nothing without a label', () => {
		const { container } = render(<ContentPageLabelChip label="" color={Color.Black} />);

		expect(container.querySelector('.c-content-page-label-chip')).toBeNull();
	});
});
