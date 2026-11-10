import { describe, expect, it, vi } from 'vitest';

vi.mock('../player-ticket', () => ({ PlayerTicketService: class {} }));
vi.mock('../mediahaven/services/mediahaven.service', () => ({ MediahavenService: class {} }));

import { DEFAULT_AUDIO_STILL } from './video-stills.consts';
import { VideoStillsService } from './video-stills.service';

describe('VideoStillsService', () => {
	it('never requests keyframes for audio items (ARC-4178)', async () => {
		const playerTicketService = {
			getBrowseUrlAndType: vi.fn(async () => ({
				browsePath: 'https://archief-media.viaa.be/viaa/OR/hash/browse.m4a',
				type: 'audio',
			})),
		};
		const service = new VideoStillsService(playerTicketService as any, {} as any);
		const getVideoStillsSpy = vi.spyOn(service as any, 'getVideoStills');

		const result = await service.getFirstVideoStills([
			{ externalId: 'audio-item', startTime: 5000 },
		]);

		expect(getVideoStillsSpy).not.toHaveBeenCalled();
		expect(result).toEqual([
			{ previewImagePath: DEFAULT_AUDIO_STILL, thumbnailImagePath: DEFAULT_AUDIO_STILL },
		]);
	});
});
