import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { IeObjectFlowPlayerWrapperProps } from '~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper';
import type { PlayableDisplayIeObject } from '~shared/services/ie-objects-service/ie-objects.types';

import { BlockHetArchiefVideo } from './BlockHetArchiefVideo';

const customClass = 'c-block-custom';
const blockId = 'c9c9f4b1-1a6f-4f0e-9d2e-9e5f1a2b3c4d';

// The proxy resolves the block's config to a ready-to-play, already cut url
const ieObject = {
	schemaIdentifier: 'qs6d5p9579',
	name: 'Some AV object',
	dctermsFormat: 'video',
	playableUrl: 'https://media.example.com/qs6d5p9579.mp4',
	mimeType: 'video/mp4',
	thumbnailUrl: null,
	maintainerName: 'VRT',
	maintainerOverlay: false,
} as unknown as PlayableDisplayIeObject;

const mockPlayableDisplayData = vi.fn<
	() => { data: (PlayableDisplayIeObject | null)[] | undefined }
>(() => ({ data: [ieObject] }));
const mockPlayer = vi.fn<(props: IeObjectFlowPlayerWrapperProps) => null>(() => null);

vi.mock('~modules/content-page/hooks/useGetIeObjectsPlayableDisplayData', () => ({
	useGetIeObjectsPlayableDisplayData: () => mockPlayableDisplayData(),
}));

// The error tile is the only part of this block that reads from the admin-core config (for its
// label and its icon), which isn't set up in a unit test.
vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

vi.mock('~shared/components/Icon', () => ({
	Icon: () => null,
}));

vi.mock(
	'~modules/content-page/components/IeObjectFlowPlayerWrapper/IeObjectFlowPlayerWrapper',
	() => ({
		IeObjectFlowPlayerWrapper: (props: IeObjectFlowPlayerWrapperProps) => mockPlayer(props),
	})
);

beforeEach(() => {
	mockPlayer.mockClear();
	mockPlayableDisplayData.mockClear();
	mockPlayableDisplayData.mockReturnValue({ data: [ieObject] });
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('<BlockHetArchiefVideo />', () => {
	it('Should be able to render', () => {
		render(<BlockHetArchiefVideo className={customClass} blockId={blockId} />);

		expect(mockPlayer).toHaveBeenCalled();
	});

	it('Should set the correct className', () => {
		const { container } = render(
			<BlockHetArchiefVideo className={customClass} blockId={blockId} />
		);
		const rootDiv = container.querySelector('div');

		expect(rootDiv).toHaveClass(customClass);
		expect(rootDiv).not.toHaveClass('o-container-vertical');
	});

	it('Should render nothing while the block has no resolved object', () => {
		mockPlayableDisplayData.mockReturnValue({ data: undefined });

		const { container } = render(<BlockHetArchiefVideo className={customClass} />);

		expect(container).toBeEmptyDOMElement();
		expect(mockPlayer).not.toHaveBeenCalled();
	});

	it('Should render nothing for an object that resolved to no playable url', () => {
		mockPlayableDisplayData.mockReturnValue({ data: [{ ...ieObject, playableUrl: null }] });

		const { container } = render(<BlockHetArchiefVideo blockId={blockId} />);

		expect(container).toBeEmptyDOMElement();
		expect(mockPlayer).not.toHaveBeenCalled();
	});

	it('Should render an error tile for an object that resolved to null', () => {
		mockPlayableDisplayData.mockReturnValue({ data: [null] });

		const { container } = render(<BlockHetArchiefVideo blockId={blockId} />);

		expect(container.querySelector('.c-ie-object-load-error')).toBeInTheDocument();
		expect(mockPlayer).not.toHaveBeenCalled();
	});

	it('Should hand the resolved object to the player', () => {
		render(<BlockHetArchiefVideo blockId={blockId} poster="poster.jpg" title="Journaal" />);

		expect(mockPlayer).toHaveBeenCalledWith(
			expect.objectContaining({ ieObject, poster: 'poster.jpg', title: 'Journaal' })
		);
	});

	describe('caption', () => {
		it('Should render the caption underneath the player', () => {
			render(
				<BlockHetArchiefVideo
					blockId={blockId}
					copyrightTitle="VRT"
					copyrightText="Fragment uit het journaal"
					copyrightIconVisible
				/>
			);

			// The title shares its span with the copyright glyph, so it reads as "© VRT"
			expect(screen.getByText(/VRT/)).toBeInTheDocument();
			expect(screen.getByText(/©/)).toBeInTheDocument();
			expect(screen.getByText('Fragment uit het journaal')).toBeInTheDocument();
		});

		it('Should render no caption when title and text are empty', () => {
			const { container } = render(<BlockHetArchiefVideo blockId={blockId} />);

			expect(container.querySelector('.a-copyright-attribution')).toBeNull();
		});
	});
});
