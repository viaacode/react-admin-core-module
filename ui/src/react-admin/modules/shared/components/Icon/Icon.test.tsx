import { render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { Icon } from './Icon';

vi.mock('~shared/helpers/is-hetarchief.ts', () => ({
	isHetArchief: () => true,
}));

describe('Icon', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => undefined);
		AdminConfigManager.setConfig({
			icon: {
				component: ({ name, className }: { name: string; className?: string }) => (
					<i className={className} data-icon={name} data-testid={`${name}-icon`} />
				),
				componentProps: {
					video: { name: 'video--light' },
				},
			},
		} as never);
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('uses a configured icon mapping', () => {
		render(<Icon name="video" />);

		expect(screen.getByTestId('video--light-icon')).toHaveAttribute('data-icon', 'video--light');
	});

	it('passes an icon-picker glyph through when it is not a config key', () => {
		render(<Icon name={'newspaper--light' as never} className="banner-icon" />);

		const icon = screen.getByTestId('newspaper--light-icon');
		expect(icon).toHaveAttribute('data-icon', 'newspaper--light');
		expect(icon).toHaveClass('banner-icon');
	});
});
