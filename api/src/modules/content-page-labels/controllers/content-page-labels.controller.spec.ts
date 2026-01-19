import { Test, type TestingModule } from '@nestjs/testing';
import { AvoSearchOrderDirection } from '@viaa/avo2-types';
import { vi, type MockInstance } from 'vitest';
import { Lookup_App_Content_Type_Enum } from '../../shared/generated/graphql-db-types-hetarchief';
import { TestingLogger } from '../../shared/logging/test-logger';
import { UpdateContentPageLabelDto } from '../dto/content-page-label.dto';
import {
	mockContentPageLabel1,
	mockContentPageLabelDto,
	mockContentPageLabelsFilteredResponse,
	mockContentPageLabelsResponse,
} from '../mocks/content-page-labels.mocks';
import { ContentPageLabelsService } from '../services/content-page-labels.service';
import { ContentPageLabelsController } from './content-page-labels.controller';

const mockContentPageLabelsService: Partial<
	Record<keyof ContentPageLabelsService, MockInstance>
> = {
	fetchContentPageLabels: vi.fn(),
	fetchContentPageLabelById: vi.fn(),
	insertContentPageLabels: vi.fn(),
	updateContentPageLabel: vi.fn(),
	deleteContentPageLabel: vi.fn(),
	getContentPageLabelsByTypeAndLabels: vi.fn(),
	getContentPageLabelsByTypeAndIds: vi.fn(),
};

describe('ContentPageLabelsController', () => {
	let contentPageLabelsController: ContentPageLabelsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ContentPageLabelsController],
			imports: [],
			providers: [
				{
					provide: ContentPageLabelsService,
					useValue: mockContentPageLabelsService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		contentPageLabelsController = module.get<ContentPageLabelsController>(
			ContentPageLabelsController
		);
	});

	afterEach(() => {
		mockContentPageLabelsService.fetchContentPageLabels.mockRestore();
	});

	it('should be defined', () => {
		expect(contentPageLabelsController).toBeDefined();
	});

	describe('fetchContentPageLabels', () => {
		it('should return content page labels', async () => {
			mockContentPageLabelsService.fetchContentPageLabels.mockResolvedValueOnce(
				mockContentPageLabelsResponse
			);

			const contentPageLabels = await contentPageLabelsController.fetchContentPageLabels(
				'0',
				'20',
				'label',
				AvoSearchOrderDirection.ASC,
				'{}'
			);

			expect(contentPageLabels).toEqual(mockContentPageLabelsResponse);
		});

		// TODO: add test in which an error is thrown
	});
	describe('fetchContentPageLabelById', () => {
		it('should return a ContentPageLabel when given an known id', async () => {
			mockContentPageLabelsService.fetchContentPageLabelById.mockResolvedValueOnce(
				mockContentPageLabelsResponse
			);

			const contentPageLabel = await contentPageLabelsController.fetchContentPageLabelById(
				mockContentPageLabel1.id.toString()
			);

			expect(contentPageLabel).toEqual(mockContentPageLabelsResponse);
		});

		// TODO: add test in which an error is thrown
	});

	describe('insertContentPageLabel', () => {
		it('should create a ContentPageLabel', async () => {
			mockContentPageLabelsService.insertContentPageLabels.mockResolvedValueOnce([
				mockContentPageLabelDto,
			]);

			const contentPageLabel = await contentPageLabelsController.insertContentPageLabels([
				mockContentPageLabelDto,
			]);

			expect(contentPageLabel).toEqual(mockContentPageLabelDto);
		});

		// TODO: add test in which an error is thrown
	});

	describe('updateContentPageLabel', () => {
		it('should update a ContentPageLabel', async () => {
			mockContentPageLabelsService.updateContentPageLabel.mockResolvedValueOnce(
				mockContentPageLabel1
			);

			const contentPageLabel = await contentPageLabelsController.updateContentPageLabel(
				mockContentPageLabel1 as UpdateContentPageLabelDto
			);

			expect(contentPageLabel).toEqual(mockContentPageLabelDto);
		});

		// TODO: add test in which an error is thrown
	});

	describe('deleteContentPageLabelById', () => {
		it('should delete a ContentPageLabel when given a known id', async () => {
			mockContentPageLabelsService.deleteContentPageLabel.mockResolvedValueOnce(true);

			const response = await contentPageLabelsController.deleteContentPageLabelById(
				mockContentPageLabel1.id.toString()
			);

			expect(response).toEqual({
				message: 'success',
			});
		});

		// TODO: add test in which an error is thrown
	});

	describe('getContentPageLabelsByType', () => {
		it('should return an array of LabelObjects when labelIds are given', async () => {
			mockContentPageLabelsService.getContentPageLabelsByTypeAndIds.mockResolvedValue(
				mockContentPageLabelsFilteredResponse
			);

			const contentPageLabels = await contentPageLabelsController.getContentPageLabelsByType({
				contentType: Lookup_App_Content_Type_Enum.FaqItem,
				labelIds: ['13d00f95-5597-4470-b5ce-d3ee96212ff4'],
				labels: ['Gebruik van het materiaal'],
			});
			expect(contentPageLabels).toEqual(mockContentPageLabelsFilteredResponse);
		});

		it('should return an array of LabelObjects when labelIds are not given', async () => {
			mockContentPageLabelsService.getContentPageLabelsByTypeAndLabels.mockResolvedValue(
				mockContentPageLabelsFilteredResponse
			);

			const contentPageLabels = await contentPageLabelsController.getContentPageLabelsByType({
				contentType: Lookup_App_Content_Type_Enum.FaqItem,
				labels: ['Gebruik van het materiaal'],
			});
			expect(contentPageLabels).toEqual(mockContentPageLabelsFilteredResponse);
		});
	});
});
