import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { BlockHeading } from './BlockHeading';

afterEach(() => {
	cleanup();
});

describe('<BlockHeading />', () => {
	it('Should be able to render', () => {
		render(<BlockHeading type="h1">BlockHeading</BlockHeading>);
	});

	it('should pass a custom className', () => {
		const customClass = 'c-heading-custom';
		const headingComponent = (
			<BlockHeading className={customClass} type="h1">
				Lorem ipsum
			</BlockHeading>
		);
		render(headingComponent);
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toHaveClass(customClass);
	});

	it('Should correctly pass children', () => {
		render(
			<BlockHeading type="h1">
				<a href="https://viaa.be/">Lorem ipsum</a>
			</BlockHeading>
		);
		const child = screen.getByRole('link');
		expect(child).toBeInTheDocument();
		const heading = screen.getByRole('heading', { level: 1 });
		expect(heading).toContainElement(child);
	});
});
