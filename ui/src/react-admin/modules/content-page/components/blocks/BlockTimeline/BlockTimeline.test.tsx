import { cleanup, render } from '@testing-library/react';
import type { HetArchiefPlayableDisplayIeObject } from '@viaa/avo2-types';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { Locale } from '~modules/translations/translations.core.types';
import { BlockTimeline } from './BlockTimeline';

const mockPlayableDisplayData = vi.fn<
	() => { data: (HetArchiefPlayableDisplayIeObject | null)[] | undefined }
>(() => ({ data: undefined }));

vi.mock('~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData.ts', () => ({
	useGetIeObjectsPlayableDisplayData: () => mockPlayableDisplayData(),
}));

vi.mock(
	'~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper.tsx',
	() => ({
		IeObjectFlowPlayerWrapper: () => null,
	})
);

vi.mock('~modules/content-page/components/IeObjectMetadata/IeObjectMetadata.tsx', () => ({
	IeObjectMetadata: () => null,
}));

// Stubbed so the tests can assert which icon variant a node asks for: the second argument is the
// "may this visitor see the essence" flag that picks between the plain and struck-through icon.
const getIconFromObjectType = vi.fn(() => 'no-newspaper');
vi.mock('~shared/helpers/get-icon-from-object-type', () => ({
	getIconFromObjectType: (...args: unknown[]) => getIconFromObjectType(...(args as [])),
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
	mockPlayableDisplayData.mockReturnValue({ data: undefined });
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

describe('<BlockTimeline /> playable display data alignment', () => {
	// The nodes are shown in chronological order, but the playable display data comes back in the
	// order the nodes were configured in -- so a node's object has to be looked up by the position
	// it has in the block config, not by the row it ends up on.
	// https://meemoo.atlassian.net/browse/ARC-3848
	const NODES = [
		{ ...NODE, date: '2020-01-01', title: 'Oldest', visualType: 'IMAGE', image: 'oldest.jpg' },
		{
			...NODE,
			date: '2026-05-01',
			title: 'Newest',
			visualType: 'OBJECT',
			mediaItem: { value: 'newspaper-id' },
		},
	];

	const newspaper = {
		schemaIdentifier: 'newspaper-id',
		name: 'Newspaper',
		dctermsFormat: 'newspaper',
		newspaperImage: 'data:image/jpeg;base64,newspaper',
		hasAccessToEssence: true,
	} as HetArchiefPlayableDisplayIeObject;

	it('shows the object of the node it was configured for, not of the row it is rendered on', () => {
		// One entry per node in configured order: the image node has no object, the newspaper does
		mockPlayableDisplayData.mockReturnValue({ data: [null, newspaper] });

		// biome-ignore lint/suspicious/noExplicitAny: partial nodes are enough for this assertion
		const { container } = render(<BlockTimeline elements={NODES as any} />);
		const nodes = Array.from(container.querySelectorAll('.c-block-timeline__node'));

		// 'Newest' is rendered first, but its object is the second entry of the response
		expect(nodes[0].querySelector('.c-block-timeline__node-title')?.textContent).toBe('Newest');
		expect(nodes[0].querySelector('.c-block-timeline__node-object-error')).toBeNull();
		expect(
			nodes[0].querySelector('.c-block-timeline__node-object-image')?.getAttribute('src')
		).toBe(newspaper.newspaperImage);
	});

	it('shows the struck-through type icon instead of the image when the visitor may not see the essence', () => {
		mockPlayableDisplayData.mockReturnValue({
			data: [null, { ...newspaper, hasAccessToEssence: false }],
		});

		// biome-ignore lint/suspicious/noExplicitAny: partial nodes are enough for this assertion
		const { container } = render(<BlockTimeline elements={NODES as any} />);
		const nodes = Array.from(container.querySelectorAll('.c-block-timeline__node'));

		expect(nodes[0].querySelector('.c-block-timeline__node-object-image')).toBeNull();
		expect(nodes[0].querySelector('.c-block-timeline__node-object-placeholder')).not.toBeNull();
		expect(getIconFromObjectType).toHaveBeenCalledWith('newspaper', false);
	});

	it('shows the plain type icon when the essence is accessible but there is no image', () => {
		mockPlayableDisplayData.mockReturnValue({
			data: [null, { ...newspaper, newspaperImage: null, thumbnailUrl: null }],
		});

		// biome-ignore lint/suspicious/noExplicitAny: partial nodes are enough for this assertion
		const { container } = render(<BlockTimeline elements={NODES as any} />);
		const nodes = Array.from(container.querySelectorAll('.c-block-timeline__node'));

		expect(nodes[0].querySelector('.c-block-timeline__node-object-image')).toBeNull();
		expect(nodes[0].querySelector('.c-block-timeline__node-object-placeholder')).not.toBeNull();
		expect(getIconFromObjectType).toHaveBeenCalledWith('newspaper', true);
	});
});
