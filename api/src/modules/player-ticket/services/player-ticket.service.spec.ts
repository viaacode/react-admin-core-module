import { CACHE_MANAGER } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { type Cache } from 'cache-manager';
import { addHours } from 'date-fns';
import nock from 'nock';

import { DataService } from '../../data';
import {
	type GetFileByRepresentationSchemaIdentifierQuery,
	type GetThumbnailUrlByIdQuery,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { TestingLogger } from '../../shared/logging/test-logger';
import { type PlayerTicket } from '../player-ticket.types';

import { PlayerTicketService } from './player-ticket.service';

const FAKE_TICKET_SERVICE_URL = 'http://ticketservice';
const FAKE_MEDIA_SERVICE_URL = 'http://mediaservice';
const FAKE_HOST = 'http://localhost';

const mockDataService = {
	execute: jest.fn(),
};

const mockCacheManager: Partial<Record<keyof Cache, jest.SpyInstance>> = {
	wrap: jest.fn(),
};

const mockPlayerTicket: PlayerTicket = {
	jwt: 'secret-jwt-token',
	context: {
		app: 'hetarchief.be',
		name: 'TESTBEELD/keyframes_all',
		referer: 'http://localhost:3200',
		ip: '',
		fragment: null,
		expiration: addHours(new Date(), 4).toISOString(),
		aud: '',
		exp: new Date().getTime() + 5000000,
		sub: '',
	},
};

describe('PlayerTicketService', () => {
	let playerTicketService: PlayerTicketService;

	beforeEach(async () => {
		process.env.TICKET_SERVICE_URL = FAKE_TICKET_SERVICE_URL;
		process.env.MEDIA_SERVICE_URL = FAKE_MEDIA_SERVICE_URL;
		process.env.HOST = FAKE_HOST;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				PlayerTicketService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: CACHE_MANAGER,
					useValue: mockCacheManager,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		playerTicketService = module.get<PlayerTicketService>(PlayerTicketService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(playerTicketService).toBeDefined();
	});

	describe('getPlayableUrl', () => {
		it('returns a playable url', async () => {
			nock(FAKE_TICKET_SERVICE_URL)
				.get('/vrt/item-1')
				.query(true)
				.reply(200, mockPlayerTicket);
			const url = await playerTicketService.getPlayableUrl('vrt/item-1', 'referer', '');
			expect(url).toEqual(
				`${FAKE_MEDIA_SERVICE_URL}/vrt/item-1?token=${mockPlayerTicket.jwt}`
			);
		});

		it('uses the fallback referer if none was set', async () => {
			nock(FAKE_TICKET_SERVICE_URL)
				.get('/vrt/item-1')
				.query({
					app: 'hetarchief.be',
					client: '',
					referer: FAKE_HOST,
					maxage: 14401,
				})
				.reply(200, mockPlayerTicket);
			const url = await playerTicketService.getPlayableUrl('vrt/item-1', undefined, '');
			expect(url).toEqual(
				`${FAKE_MEDIA_SERVICE_URL}/vrt/item-1?token=${mockPlayerTicket.jwt}`
			);
		});
	});

	describe('getEmbedUrl', () => {
		it('returns the embedUrl for an item', async () => {
			const mockData: GetFileByRepresentationSchemaIdentifierQuery = {
				graph_representation: [
					{ includes: [{ file: { premis_stored_at: 'vrt/item-1' } }] },
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const url = await playerTicketService.getEmbedUrl('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('returns the embedUrl for an avo item', async () => {
			const mockData: GetFileByRepresentationSchemaIdentifierQuery = {
				graph_representation: [
					{ includes: [{ file: { premis_stored_at: 'vrt/item-1' } }] },
				],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const url = await playerTicketService.getEmbedUrl('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('throws a not found exception if the item was not found', async () => {
			const mockData: GetFileByRepresentationSchemaIdentifierQuery = {
				graph_representation: [{ includes: [] }],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			let error;
			try {
				await playerTicketService.getEmbedUrl('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				additionalInfo: {
					id: 'unknown-id',
				},
				innerException: null,
				message: 'Object embed url not found',
			});
		});
	});

	describe('getPlayerToken', () => {
		it('returns a token for a playable item', async () => {
			nock(FAKE_TICKET_SERVICE_URL)
				.get('/vrt/browse.mp4')
				.query(true)
				.reply(200, mockPlayerTicket);

			const token = await playerTicketService.getPlayerToken(
				'vrt/browse.mp4',
				'referer',
				'',
				false
			);
			expect(token).toEqual(mockPlayerTicket.jwt);
		});

		it('uses the fallback referer if none was set', async () => {
			nock(FAKE_TICKET_SERVICE_URL)
				.get('/vrt/browse.mp4')
				.query({
					app: 'hetarchief.be',
					client: '',
					referer: FAKE_HOST,
					maxage: 14401,
				})
				.reply(200, mockPlayerTicket);
			const token = await playerTicketService.getPlayerToken(
				'vrt/browse.mp4',
				undefined,
				'',
				false
			);
			expect(token).toEqual(mockPlayerTicket.jwt);
		});

		it('return a 15 year token for public domain images', async () => {
			nock(FAKE_TICKET_SERVICE_URL)
				.get('/vrt/browse.mp4')
				.query({
					app: 'hetarchief.be',
					client: '',
					referer: '',
					maxage: 15 * 365 * 24 * 60 * 60, // 15 years
				})
				.reply(200, {
					...mockPlayerTicket,
					jwt: mockPlayerTicket.jwt + '15j', // Simulate a 15 year token
				});
			const token = await playerTicketService.getPlayerToken(
				'vrt/browse.mp4',
				undefined,
				'',
				true
			);
			expect(token).toEqual(mockPlayerTicket.jwt + '15j');
		});
	});

	describe('getThumbnailToken', () => {
		it('returns a thumbnail token', async () => {
			// http://ticketservice//TESTBEELD/keyframes_all?app=hetarchief.be&client=78.21.19.187&referer=referer&maxage=14401
			nock(FAKE_TICKET_SERVICE_URL)
				.get('/TESTBEELD/keyframes_all')
				.query(true)
				.reply(200, mockPlayerTicket);

			mockCacheManager.wrap.mockImplementationOnce(async (key, fn) => {
				return await fn();
			});
			const token = await playerTicketService.getThumbnailTokenCached(
				'TESTBEELD/keyframes_all',
				'referer',
				'127.0.0.1'
			);
			expect(token).toEqual(mockPlayerTicket);
		});

		it('throws an InternalServerErrorException on error', async () => {
			mockCacheManager.wrap.mockRejectedValueOnce('error');
			let error;
			try {
				await playerTicketService.getThumbnailTokenCached(
					'/TESTBEELD/keyframes_all',
					'referer',
					'127.0.0.1'
				);
			} catch (e) {
				error = e;
			}
			expect(error.name).toEqual('InternalServerErrorException');
			expect(error.message).toEqual('Could not get a thumbnail token');
		});
	});

	describe('getThumbnailUrl', () => {
		it('returns a thumbnail url', async () => {
			const mockData: GetThumbnailUrlByIdQuery = {
				graph__intellectual_entity: [{ schema_thumbnail_url: 'vrt/item-1' }],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const getThumbnailTokenSpy = jest
				.spyOn(playerTicketService, 'getThumbnailTokenCached')
				.mockResolvedValueOnce(mockPlayerTicket.jwt);

			const url = await playerTicketService.getThumbnailUrl('vrt-id', 'referer', '');
			expect(url).toEqual(
				`${FAKE_MEDIA_SERVICE_URL}/vrt/item-1?token=${mockPlayerTicket.jwt}`
			);

			getThumbnailTokenSpy.mockRestore();
		});
	});

	describe('resolveThumbnailUrl', () => {
		it('does not get a token for an invalid path', async () => {
			const getThumbnailTokenSpy = jest.spyOn(playerTicketService, 'getThumbnailTokenCached');

			const url = await playerTicketService.resolveThumbnailUrl('', 'referer', '');
			expect(url).toBeNull();
			expect(getThumbnailTokenSpy).not.toBeCalled();

			getThumbnailTokenSpy.mockRestore();
		});

		it('does not get a token for an invalid referer', async () => {
			const getThumbnailTokenSpy = jest.spyOn(playerTicketService, 'getThumbnailTokenCached');

			const url = await playerTicketService.resolveThumbnailUrl(
				'http://thumbnail.jpg',
				null,
				''
			);
			expect(url).toEqual('http://thumbnail.jpg');
			expect(getThumbnailTokenSpy).not.toBeCalled();

			getThumbnailTokenSpy.mockRestore();
		});
	});

	describe('getThumbnailPath', () => {
		it('returns the thumbnail url for an item', async () => {
			const mockData: GetThumbnailUrlByIdQuery = {
				graph__intellectual_entity: [{ schema_thumbnail_url: 'vrt/item-1' }],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const url = await playerTicketService.getThumbnailPath('vrt-id');
			expect(url).toEqual('vrt/item-1');
		});

		it('throws a notfoundexception if the item was not found', async () => {
			const mockData: GetThumbnailUrlByIdQuery = {
				graph__intellectual_entity: [],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			let error;
			try {
				await playerTicketService.getThumbnailPath('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				error: 'Not Found',
				message: "Object IE with id 'unknown-id' not found",
				statusCode: 404,
			});
		});
	});
});
