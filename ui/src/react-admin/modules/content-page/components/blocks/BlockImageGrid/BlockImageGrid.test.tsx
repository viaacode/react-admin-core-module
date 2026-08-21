import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { BlockImageGrid } from './BlockImageGrid';

afterEach(() => cleanup());

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
