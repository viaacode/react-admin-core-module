import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { Locale } from '~modules/translations/translations.core.types';
import { BlockImageGrid } from './BlockImageGrid';

beforeEach(() => {
	vi.spyOn(AdminConfigManager, 'getConfig').mockReturnValue({
		locale: Locale.Nl,
		services: { i18n: { tText: (key: string) => key } },
		// biome-ignore lint/suspicious/noExplicitAny: only the locale and i18n keys are read here
	} as any);
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

const ELEMENT = {
	source: '/image.jpg',
	title: 'Grid title',
	text: 'Grid description',
};

describe('<BlockImageGrid /> text colors', () => {
	it('uses background text roles when no foreground color was supplied', () => {
		const { container } = render(<BlockImageGrid elements={[ELEMENT]} />);

		expect(container.querySelector('.c-block-grid__text-wrapper')).toHaveClass(
			'u-background-text-primary'
		);
		expect(screen.getByText('Grid title')).not.toHaveClass('u-background-text-primary');
		expect(screen.getByText('Grid description')).not.toHaveClass('u-background-text-primary');
	});

	it('preserves a caller-supplied foreground color', () => {
		const { container } = render(<BlockImageGrid elements={[ELEMENT]} textColor="#123456" />);
		const textWrapper = container.querySelector('.c-block-grid__text-wrapper');

		expect(textWrapper).not.toHaveClass('u-background-text-primary');
		expect(textWrapper).toHaveStyle({ color: '#123456' });
		expect(screen.getByText('Grid title')).not.toHaveClass('u-background-text-primary');
	});
});
