import { cleanup, render, screen } from '@testing-library/react';
import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import type { FunctionComponent } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminConfigManager } from '~core/config/config.class';
import type { AudioOrVideoPlayerWrapperProps } from '~shared/components/AudioOrVideoPlayerWrapper';

import { BlockHetArchiefVideo } from './BlockHetArchiefVideo';

const customClass = 'c-block-custom';

const mediaItem = {
	label: 'Some AV object',
	type: AvoCoreContentPickerType.IE_OBJECT,
	value: 'qs6d5p9579',
};

// Stands in for the player that the client registers under components.audioOrVideoPlayer, so we
// can assert which snippet the block asks for.
const mockPlayer = vi.fn<(props: AudioOrVideoPlayerWrapperProps) => null>(() => null);

beforeEach(() => {
	mockPlayer.mockClear();
	vi.spyOn(AdminConfigManager, 'getConfig').mockReturnValue({
		components: { audioOrVideoPlayer: mockPlayer as unknown as FunctionComponent },
		// biome-ignore lint/suspicious/noExplicitAny: only the components key is read here
	} as any);
});

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
});

describe('<BlockHetArchiefVideo />', () => {
	it('Should be able to render', () => {
		render(<BlockHetArchiefVideo className={customClass} mediaItem={mediaItem} />);

		expect(mockPlayer).toHaveBeenCalled();
	});

	it('Should set the correct className', () => {
		const { container } = render(
			<BlockHetArchiefVideo className={customClass} mediaItem={mediaItem} />
		);
		const rootDiv = container.querySelector('div');

		expect(rootDiv).toHaveClass(customClass);
		expect(rootDiv).toHaveClass('o-container-vertical');
	});

	it('Should render nothing without an object', () => {
		const { container } = render(<BlockHetArchiefVideo className={customClass} />);

		expect(container).toBeEmptyDOMElement();
		expect(mockPlayer).not.toHaveBeenCalled();
	});

	it('Should pass the object pid to the player', () => {
		render(<BlockHetArchiefVideo mediaItem={mediaItem} />);

		expect(mockPlayer).toHaveBeenCalledWith(
			expect.objectContaining({ schemaIdentifier: 'qs6d5p9579' }),
			undefined
		);
	});

	describe('snippet times', () => {
		const renderWithTimes = (startTime?: string, endTime?: string) =>
			render(
				<BlockHetArchiefVideo mediaItem={mediaItem} startTime={startTime} endTime={endTime} />
			);

		const playerProps = () => mockPlayer.mock.calls[0][0];

		it('Should convert HH:MM:SS to seconds', () => {
			renderWithTimes('00:00:10', '00:01:30');

			expect(playerProps()).toMatchObject({ startTime: 10, endTime: 90 });
		});

		it('Should convert MM:SS to seconds', () => {
			renderWithTimes('00:10', '01:30');

			expect(playerProps()).toMatchObject({ startTime: 10, endTime: 90 });
		});

		it('Should play the whole object when no times are given', () => {
			renderWithTimes(undefined, undefined);

			expect(playerProps()).toMatchObject({ startTime: undefined, endTime: undefined });
		});

		// The media service only cuts when it gets an end time, so half a pair must not be sent.
		it('Should not cut when only one of the times is given', () => {
			renderWithTimes('00:00:10', undefined);

			expect(playerProps()).toMatchObject({ startTime: undefined, endTime: undefined });
		});

		it('Should not cut when the end time is not after the start time', () => {
			renderWithTimes('00:01:30', '00:00:10');

			expect(playerProps()).toMatchObject({ startTime: undefined, endTime: undefined });
		});

		it('Should not cut on an unparseable time', () => {
			renderWithTimes('nonsense', '00:01:30');

			expect(playerProps()).toMatchObject({ startTime: undefined, endTime: undefined });
		});

		it('Should support a snippet starting at 0', () => {
			renderWithTimes('00:00:00', '00:00:30');

			expect(playerProps()).toMatchObject({ startTime: 0, endTime: 30 });
		});
	});

	describe('caption', () => {
		it('Should render the caption underneath the player', () => {
			render(
				<BlockHetArchiefVideo
					mediaItem={mediaItem}
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
			const { container } = render(<BlockHetArchiefVideo mediaItem={mediaItem} />);

			expect(container.querySelector('.a-copyright-attribution')).toBeNull();
		});
	});
});
