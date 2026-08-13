import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
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
	SmartLink: ({
		action,
		children,
		className,
	}: {
		action: { target: string; value: string };
		children: ReactNode;
		className: string;
	}) => (
		<a className={className} href={action.value} target={action.target}>
			{children}
		</a>
	),
}));

describe('BlockDoubleBanner', () => {
	it('wraps each complete half in a same-tab link and keeps its media decorative', () => {
		render(
			<BlockDoubleBanner
				halves={[
					{
						label: 'Newspapers',
						icon1: 'newspaper',
						icon2: 'newspaper',
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
			for (const icon of link.querySelectorAll('[data-icon]')) {
				expect(icon).toHaveAttribute('aria-hidden', 'true');
			}
		}
	});
});
