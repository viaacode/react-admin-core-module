import { cleanup, render } from '@testing-library/react';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { Locale } from '~modules/translations/translations.core.types';
import { BlockTimeline } from './BlockTimeline';

vi.mock('~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData.ts', () => ({
	useGetIeObjectsPlayableDisplayData: () => ({ data: undefined }),
}));

const NODE = {
	date: '2026-05-01',
	title: 'Node title',
	text: '<p>Body with a <a href="https://example.org">link</a></p>',
	visualType: 'NONE',
};

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

describe('<BlockTimeline /> text colors', () => {
	it('gives the date the neutral text role of the block background', () => {
		// biome-ignore lint/suspicious/noExplicitAny: a partial node is enough for a class assertion
		const { container } = render(<BlockTimeline elements={[NODE as any]} />);

		expect(container.querySelector('.c-block-timeline__node-date')).toHaveClass(
			'u-background-text-secondary'
		);
	});

	it('lets the description its inline links follow the background link color', () => {
		// biome-ignore lint/suspicious/noExplicitAny: a partial node is enough for a class assertion
		const { container } = render(<BlockTimeline elements={[NODE as any]} />);

		expect(container.querySelector('.c-block-timeline__node-description')).toHaveClass(
			'u-background-text-links'
		);
	});
});

describe('<BlockTimeline /> sorting', () => {
	const NODES = [
		{ ...NODE, date: '2024-03-02', title: 'Middle' },
		{ ...NODE, date: '2020-01-01', title: 'Oldest' },
		{ ...NODE, date: '2026-05-01', title: 'Newest' },
	];

	const renderedTitles = (container: HTMLElement) =>
		Array.from(container.querySelectorAll('.c-block-timeline__node-title')).map(
			(node) => node.textContent
		);

	it('shows the most recent node first by default', () => {
		// biome-ignore lint/suspicious/noExplicitAny: partial nodes are enough for an order assertion
		const { container } = render(<BlockTimeline elements={NODES as any} />);

		expect(renderedTitles(container)).toEqual(['Newest', 'Middle', 'Oldest']);
	});

	it('shows the oldest node first when sorted ascending', () => {
		const { container } = render(
			// biome-ignore lint/suspicious/noExplicitAny: partial nodes are enough for an order assertion
			<BlockTimeline elements={NODES as any} sortOrder={AvoSearchOrderDirection.ASC} />
		);

		expect(renderedTitles(container)).toEqual(['Oldest', 'Middle', 'Newest']);
	});

	it('keeps nodes without a usable date at the end, in their configured order', () => {
		const nodes = [
			{ ...NODE, date: '', title: 'No date' },
			{ ...NODE, date: '2020-01-01', title: 'Oldest' },
			{ ...NODE, date: '2026-05-01', title: 'Newest' },
		];
		const { container } = render(
			// biome-ignore lint/suspicious/noExplicitAny: partial nodes are enough for an order assertion
			<BlockTimeline elements={nodes as any} sortOrder={AvoSearchOrderDirection.ASC} />
		);

		expect(renderedTitles(container)).toEqual(['Oldest', 'Newest', 'No date']);
	});
});
