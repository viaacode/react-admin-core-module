import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { BlockDoubleBanner } from './BlockDoubleBanner';

vi.mock('@viaa/avo2-components', () => ({
	LinkTarget: { Self: '_self' },
	Image: ({ alt, src }: { alt: string; src: string }) => <img alt={alt} src={src} />,
}));

vi.mock('~shared/components/Icon/Icon', () => ({
	Icon: ({ name, ...props }: { name: string; 'aria-hidden'?: boolean }) => (
		<i data-icon={name} {...props} />
	),
}));

vi.mock('~shared/components/SmartLink/SmartLink', () => ({
	generateSmartLink: (
		action: { target: string; value: string },
		children: ReactNode,
		_title?: string,
		className?: string
	) => (
		<a className={className} href={action.value} target={action.target}>
			{children}
		</a>
	),
}));

describe('BlockDoubleBanner', () => {
	beforeEach(() => {
		AdminConfigManager.setConfig({
			icon: {
				component: ({ name, className }: { name: string; className?: string }) => (
					<i className={className} data-icon={name} />
				),
				componentProps: {
					newspaper: { name: 'newspaper--light' },
				},
			},
		} as never);
	});

	it('wraps each complete half in a same-tab link and keeps its media decorative', () => {
		render(
			<BlockDoubleBanner
				halves={[
					{
						label: 'Newspapers',
						icon1: 'newspaper',
						icon2: 'video--light',
						link: { value: '/newspapers' } as never,
						image: '/newspapers.jpg',
						textColor: '#FFF',
						backgroundColor: '#000',
					},
					{
						label: 'Audio and video',
						link: { value: '/av' } as never,
						image: '/av.jpg',
						textColor: '#FFF',
						backgroundColor: '#000',
					},
				]}
			/>
		);

		const links = screen.getAllByRole('link');
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveAttribute('href', '/newspapers');
		expect(links[0]).toHaveAttribute('target', '_self');
		expect(links[1]).toHaveAttribute('href', '/av');
		expect(links[1]).toHaveAttribute('target', '_self');

		for (const link of links) {
			expect(link.querySelector('img')).toHaveAttribute('alt', '');
			expect(link.querySelector('.c-block-double-banner__actions')).toHaveAttribute(
				'aria-hidden',
				'true'
			);
		}
		expect(links[0].querySelector('[data-icon="newspaper--light"]')).toBeInTheDocument();
		expect(links[0].querySelector('[data-icon="video--light"]')).toBeInTheDocument();
	});
});
