import { render, screen } from '@testing-library/react';
import { AvoCoreDatabaseType } from '@viaa/avo2-types';
import type { ReactNode } from 'react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { BlockDoubleBanner } from './BlockDoubleBanner';

// The real Icon is used on purpose here: the editor stores icons by their raw name
// (eg: newspaper--light), not by their admin-core config key (eg: newspaper).
vi.mock('~shared/components/SmartLink/SmartLink', () => ({
	generateSmartLink: (_action: unknown, children: ReactNode) => <div>{children}</div>,
}));

const half = (label: string, icon?: string) => ({
	label,
	icon1: icon,
	link: { type: 'EXTERNAL_LINK', value: `/${label}` },
	image: `/${label}.jpg`,
	textColor: '#FFFFFF',
	backgroundColor: '#000000',
});

describe('BlockDoubleBanner icons', () => {
	it('renders an icon that the editor picked by its raw name', () => {
		AdminConfigManager.setConfig({
			icon: {
				component: ({ name, className }: { name: string; className?: string }) => (
					<i className={className} data-testid={`icon-${name}`} />
				),
				componentProps: { arrowDownRight: { name: 'arrow-down-right--light' } },
				list: () => [{ label: 'Newspaper light', value: 'newspaper--light' }],
			},
			env: { DATABASE_APPLICATION_TYPE: AvoCoreDatabaseType.hetArchief },
		} as never);

		render(<BlockDoubleBanner halves={[half('kranten', 'newspaper--light'), half('beeld')] as never} />);

		expect(screen.getByTestId('icon-newspaper--light')).toBeInTheDocument();
		// Both halves keep their CTA arrow, which resolves through the config key.
		expect(screen.getAllByTestId('icon-arrow-down-right--light')).toHaveLength(2);
	});
});
