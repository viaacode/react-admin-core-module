import { Test, type TestingModule } from '@nestjs/testing';
import { type MockInstance, vi } from 'vitest';

import { DataService } from '../../data';
import { AdminOrganisationsService } from '../../organisations';
import { PlayerTicketService } from '../../player-ticket';

import { ContentPagesService } from './content-pages.service';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, MockInstance>> = {
	getPlayableUrl: vi.fn(),
	getBrowseUrl: vi.fn(),
};

const mockOrganisationsService: Partial<Record<keyof AdminOrganisationsService, MockInstance>> = {
	getOrganisation: vi.fn(),
	adapt: vi.fn(),
};

describe('ContentPagesService', () => {
	let contentPagesService: ContentPagesService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContentPagesService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
				{
					provide: AdminOrganisationsService,
					useValue: mockOrganisationsService,
				},
			],
		}).compile();

		contentPagesService = module.get<ContentPagesService>(ContentPagesService);
	});

	it('services should be defined', () => {
		expect(contentPagesService).toBeDefined();
	});

	describe('adaptContentPage', () => {
		it('should adapt a graphql contentPage response to our contentPage interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return null in the gql contentPage is undefined', () => {
			const adapted = contentPagesService.adaptContentPage(undefined);
			expect(adapted).toBeNull();
		});
	});

	describe('adaptContentBlock', () => {
		it('should adapt a graphql content block response to our contentPage interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return null in the gql content block is undefined', () => {
			const adapted = contentPagesService.adaptContentBlock(undefined);
			expect(adapted).toBeNull();
		});
	});

	describe('adaptUser', () => {
		it('should adapt a graphql contentPage owner to our contentPageUser interface', () => {
			// const adapted = contentPagesService.adaptContentPage(mockGqlContentPage);
			// // test some sample keys
			// expect(adapted.id).toEqual(mockGqlContentPage.id);
			// expect(adapted.type).toEqual(mockGqlContentPage.type);
			// expect(adapted.visitId).toEqual(mockGqlContentPage.visit_id);
		});

		it('should return null in the gql content page owner is undefined', () => {
			const adapted = contentPagesService.adaptUser(undefined);
			expect(adapted).toBeNull();
		});
	});

	describe('getContentPagesForPageOverviewBlock', () => {
		const baseQuery = {
			withBlocks: false,
			contentType: 'BLOG_POST',
			labelIds: ['label-1', 'label-2'],
			selectedLabelIds: ['label-1', 'label-2'],
			orderProp: 'title',
			orderDirection: 'asc',
			offset: 0,
			limit: 2,
		};

		it('should fetch the pages per label when groupByLabel is set', async () => {
			const fetchSpy = vi
				// biome-ignore lint/suspicious/noExplicitAny: spy on private method
				.spyOn(contentPagesService as any, 'fetchPageOverviewPages')
				.mockResolvedValueOnce({
					items: [{ id: 'a' }, { id: 'b' }],
					count: 5,
					labelCounts: { 'label-1': 5, 'label-2': 1 },
				})
				.mockResolvedValueOnce({ items: [{ id: 'b' }], count: 1, labelCounts: {} });

			const response = await contentPagesService.getContentPagesForPageOverviewBlock(
				// biome-ignore lint/suspicious/noExplicitAny: test input
				{ ...baseQuery, groupByLabel: true } as any,
				['group-1']
			);

			expect(fetchSpy).toHaveBeenCalledTimes(2);
			expect(fetchSpy.mock.calls[0][0]).toMatchObject({
				selectedLabelIds: ['label-1'],
				labelIds: ['label-1', 'label-2'],
			});
			expect(fetchSpy.mock.calls[1][0]).toMatchObject({
				selectedLabelIds: ['label-2'],
				labelIds: [],
			});
			expect(response.itemsByLabel).toEqual({
				'label-1': [{ id: 'a' }, { id: 'b' }],
				'label-2': [{ id: 'b' }],
			});
			expect(response.items).toEqual([{ id: 'a' }, { id: 'b' }]);
			expect(response.labelCounts).toEqual({ 'label-1': 5, 'label-2': 1 });
			expect(response.pages).toEqual(3);
		});

		it('should fetch all pages in one query when groupByLabel is not set', async () => {
			const fetchSpy = vi
				// biome-ignore lint/suspicious/noExplicitAny: spy on private method
				.spyOn(contentPagesService as any, 'fetchPageOverviewPages')
				.mockResolvedValueOnce({ items: [{ id: 'a' }], count: 1, labelCounts: {} });

			const response = await contentPagesService.getContentPagesForPageOverviewBlock(
				// biome-ignore lint/suspicious/noExplicitAny: test input
				baseQuery as any,
				['group-1']
			);

			expect(fetchSpy).toHaveBeenCalledTimes(1);
			expect(response.itemsByLabel).toBeUndefined();
			expect(response.items).toEqual([{ id: 'a' }]);
		});
	});
});
