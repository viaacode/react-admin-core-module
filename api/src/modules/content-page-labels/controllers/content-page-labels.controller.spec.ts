import { Test, TestingModule } from '@nestjs/testing';
import { TestingLogger } from '../../shared/logging/test-logger';
import { mockContentPageLabel1, mockContentPageLabelsResponse } from '../mocks/content-page-labels.mocks';
import { ContentPageLabelsService } from '../services/content-page-labels.service';
import { ContentPageLabelsController } from './content-page-labels.controller';

const mockContentPageLabelsService: Partial<
	Record<keyof ContentPageLabelsService, jest.SpyInstance>
> = {
	fetchContentPageLabels: jest.fn(),
	fetchContentPageLabelById: jest.fn(),
	insertContentPageLabel: jest.fn(),
	updateContentPageLabel: jest.fn(),
	deleteContentPageLabel: jest.fn(),
	getContentPageLabelsByTypeAndLabels: jest.fn(),
	getContentPageLabelsByTypeAndIds: jest.fn(),
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
			ContentPageLabelsController,
		);
	});

	afterEach(() => {
		mockContentPageLabelsService.fetchContentPageLabels.mockRestore();
	})

	it('should be defined', () => {
		expect(contentPageLabelsController).toBeDefined();
	});

	describe('fetchContentPageLabels', () => {
		it('should return content page labels', async () => { //uileg nog beter maken
			mockContentPageLabelsService.fetchContentPageLabels.mockResolvedValueOnce(mockContentPageLabelsResponse);

			const contentPageLabels = await contentPageLabelsController.fetchContentPageLabels(
				'0', '20', 'label', 'asc', '{}'
			);

			expect(contentPageLabels).toEqual(mockContentPageLabelsResponse);
		});
		it('should return an error', async () => { //uileg nog beter maken
			mockContentPageLabelsService.fetchContentPageLabels.mockRejectedValueOnce(mockContentPageLabelsResponse);

			try {
				await contentPageLabelsController.fetchContentPageLabels(
					'0', '20', 'label', 'asc', 'invalidJSON'
				);
			} catch(error) {
				expect(error.message).toEqual("Failed to get content page labels from the database");
			}
		});
	});
	describe('fetchContentPageLabelById', () => {
		it('should return a ContentPageLabel given an known id', async () => {
			mockContentPageLabelsService.fetchContentPageLabelById.mockResolvedValueOnce(mockContentPageLabelsResponse);

			const contentPageLabel = await contentPageLabelsController.fetchContentPageLabelById(mockContentPageLabel1.id.toString());

			expect(contentPageLabel).toEqual(mockContentPageLabelsResponse);
		});

		it('should return an error when given an unkown id', async () => {
			mockContentPageLabelsService.fetchContentPageLabels.mockRejectedValueOnce(mockContentPageLabelsResponse);

			try {
				await contentPageLabelsController.fetchContentPageLabelById('unknown-id');
			} catch(error) {
				expect(error.message).toEqual("Failed to get content page label from the database");
			}
		});
		
	});
});
