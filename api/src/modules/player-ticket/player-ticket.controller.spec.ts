import { BadRequestException } from '@nestjs/common';
import { vi } from 'vitest';

import { PlayerTicketController } from './player-ticket.controller';
import type { PlayerTicketService } from './services/player-ticket.service';

const FAKE_BROWSE_PATH = 'http://mediaservice/play/v2/TESTBEELD/some-hash/browse.mp4';
const FAKE_FILE_PATH = 'TESTBEELD/some-hash/browse.mp4';
const FAKE_PLAYABLE_URL = `http://mediaservice/${FAKE_FILE_PATH}?token=secret`;

const mockPlayerTicketService = {
	getBrowseUrlAndType: vi.fn(),
	urlToFilePath: vi.fn(),
	getPlayableUrl: vi.fn(),
};

// The controller only reads the Referer header off the request.
const mockRequest = { header: () => 'http://localhost:3200' } as unknown as Request;

describe('PlayerTicketController', () => {
	let playerTicketController: PlayerTicketController;

	beforeEach(() => {
		// Instantiated directly rather than through Nest's TestingModule: this package has no
		// decorator-metadata transform configured for vitest, so constructor injection into a
		// controller does not resolve in tests.
		playerTicketController = new PlayerTicketController(
			mockPlayerTicketService as unknown as PlayerTicketService
		);

		mockPlayerTicketService.getBrowseUrlAndType.mockResolvedValue({
			browsePath: FAKE_BROWSE_PATH,
			type: 'video',
			startTime: undefined,
			endTime: undefined,
		});
		mockPlayerTicketService.urlToFilePath.mockReturnValue(FAKE_FILE_PATH);
		mockPlayerTicketService.getPlayableUrl.mockResolvedValue(FAKE_PLAYABLE_URL);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should be defined', () => {
		expect(playerTicketController).toBeDefined();
	});

	describe('getPlayableUrl', () => {
		const getPlayableUrl = (query: { startTime?: string; endTime?: string }) =>
			playerTicketController.getPlayableUrl(
				{
					externalId: '8k74t8bn2s',
					externalIds: undefined,
					browsePath: undefined,
					startTime: undefined,
					endTime: undefined,
					...query,
				},
				mockRequest,
				'127.0.0.1'
			);

		it('should require an externalId, externalIds or browsePath', async () => {
			await expect(
				playerTicketController.getPlayableUrl(
					{
						externalId: undefined,
						externalIds: undefined,
						browsePath: undefined,
						startTime: undefined,
						endTime: undefined,
					},
					mockRequest,
					'127.0.0.1'
				)
			).rejects.toThrow(BadRequestException);
		});

		it('should pass no times when none are given', async () => {
			await getPlayableUrl({});

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				FAKE_FILE_PATH,
				expect.objectContaining({ startTime: undefined, endTime: undefined })
			);
		});

		it('should parse a valid start and end time into whole seconds', async () => {
			await getPlayableUrl({ startTime: '15', endTime: '45' });

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				FAKE_FILE_PATH,
				expect.objectContaining({ startTime: 15, endTime: 45 })
			);
		});

		it('should treat an empty time string as absent', async () => {
			await getPlayableUrl({ startTime: '', endTime: '' });

			expect(mockPlayerTicketService.getPlayableUrl).toHaveBeenCalledWith(
				FAKE_FILE_PATH,
				expect.objectContaining({ startTime: undefined, endTime: undefined })
			);
		});

		// The pattern used to be unanchored, so these were accepted and parsed to NaN, which
		// silently disabled the cut further down the chain instead of failing.
		it.each([
			'a1',
			'1a',
			'abc',
			'1.5',
			'-1',
			' 1',
		])('should reject the non-numeric time "%s"', async (startTime) => {
			await expect(getPlayableUrl({ startTime, endTime: '45' })).rejects.toThrow(
				BadRequestException
			);
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
		});

		it('should reject a start time without an end time', async () => {
			await expect(getPlayableUrl({ startTime: '15' })).rejects.toThrow(BadRequestException);
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
		});

		it('should reject an end time without a start time', async () => {
			await expect(getPlayableUrl({ endTime: '45' })).rejects.toThrow(BadRequestException);
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
		});

		it('should reject an end time that is not after the start time', async () => {
			await expect(getPlayableUrl({ startTime: '45', endTime: '15' })).rejects.toThrow(
				BadRequestException
			);
			await expect(getPlayableUrl({ startTime: '45', endTime: '45' })).rejects.toThrow(
				BadRequestException
			);
			expect(mockPlayerTicketService.getPlayableUrl).not.toHaveBeenCalled();
		});
	});
});
