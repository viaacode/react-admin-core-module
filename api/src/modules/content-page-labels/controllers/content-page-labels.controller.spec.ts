import { Test, TestingModule } from '@nestjs/testing';
import { Lookup_App_Content_Type_Enum } from '../../shared/generated/graphql-db-types-hetarchief';
import { TestingLogger } from '../../shared/logging/test-logger';
import { mockContentPageLabel1, mockContentPageLabelDto, mockContentPageLabelsFilteredResponse, mockContentPageLabelsResponse } from '../mocks/content-page-labels.mocks';
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
				expect(error.message).toEqual('Failed to get content page labels from the database');
			}
		});
	});
	describe('fetchContentPageLabelById', () => {
		it('should return a ContentPageLabel when given an known id', async () => {
			mockContentPageLabelsService.fetchContentPageLabelById.mockResolvedValueOnce(mockContentPageLabelsResponse);

			const contentPageLabel = await contentPageLabelsController.fetchContentPageLabelById(mockContentPageLabel1.id.toString());

			expect(contentPageLabel).toEqual(mockContentPageLabelsResponse);
		});

		it('should return an error when given an unkown id', async () => {
			mockContentPageLabelsService.fetchContentPageLabels.mockRejectedValueOnce(mockContentPageLabelsResponse);

			try {
				await contentPageLabelsController.fetchContentPageLabelById('unknown-id');
			} catch(error) {
				expect(error.message).toEqual('Failed to get content page label from the database');
			}
		});
	});

	describe('insertContentPageLabel', () => {
		it('should create a ContentPageLabel', async () => {
			mockContentPageLabelsService.insertContentPageLabel.mockResolvedValueOnce(mockContentPageLabelDto);

			const contentPageLabel = await contentPageLabelsController.insertContentPageLabel(mockContentPageLabelDto);

			expect(contentPageLabel).toEqual(mockContentPageLabelDto);
		});

		// it('should return an error when it fails to insert into the database', async () => {
		// 	mockContentPageLabelsService.insertContentPageLabel.mockRejectedValueOnce(mockContentPageLabelDto);

		// 	try {
		// 		await contentPageLabelsController.insertContentPageLabel(mockContentPageLabelDto);
		// 	} catch(error) {
		// 		console.log(error);
		// 		expect(error.message).toEqual('Failed to insert content page label in the database');
		// 	}
		// });
	});

	describe('updateContentPageLabel', () => {
		it('should update a ContentPageLabel', async () => {
			mockContentPageLabelsService.updateContentPageLabel.mockResolvedValueOnce(mockContentPageLabel1);

			const contentPageLabel = await contentPageLabelsController.updateContentPageLabel(mockContentPageLabel1);

			expect(contentPageLabel).toEqual(mockContentPageLabelDto);
		});

		// it('should return an error when it fails to update in the database', async () => {
		// 	mockContentPageLabelsService.updateContentPageLabel.mockRejectedValueOnce(mockContentPageLabelDto);

		// 	try {
		// 		await contentPageLabelsController.updateContentPageLabel(mockContentPageLabelDto);
		// 	} catch(error) {
		// 		console.log(error);
		// 		expect(error.message).toEqual('Failed to update content page label in the database');
		// 	}
		// });
	});

	describe('deleteContentPageLabelById', () => {
		it('should delete a ContentPageLabel when given a known id', async () => {
			mockContentPageLabelsService.deleteContentPageLabel.mockResolvedValueOnce(true);

			const response = await contentPageLabelsController.deleteContentPageLabelById(mockContentPageLabel1.id.toString());

			expect(response).toEqual({
				message: 'success'
			});
		});

		it('should return an error when it fails to delete a ContentPageLabel in the database', async () => {
			mockContentPageLabelsService.deleteContentPageLabel.mockRejectedValueOnce(false);

			try {
				await contentPageLabelsController.deleteContentPageLabelById('unknown-id');
			} catch(error) {
				expect(error.message).toEqual('Failed to delete the content page label from the database');
			}
		});
	});

	describe('getContentPageLabelsByType', () => {
		it('should return an array of LabelObjects when labelIds are given', async () => {
			mockContentPageLabelsService.getContentPageLabelsByTypeAndIds.mockResolvedValue(mockContentPageLabelsFilteredResponse);

			const contentPageLabels = await contentPageLabelsController.getContentPageLabelsByType(
				{
					contentType: Lookup_App_Content_Type_Enum.FaqItem,
					labelIds: [
						"13d00f95-5597-4470-b5ce-d3ee96212ff4"
					],
					labels: [
						"Gebruik van het materiaal"
					]
				}
			);
			expect(contentPageLabels).toEqual(mockContentPageLabelsFilteredResponse);
		});

		it('should return an array of LabelObjects when labelIds are not given', async () => {
			mockContentPageLabelsService.getContentPageLabelsByTypeAndLabels.mockResolvedValue(mockContentPageLabelsFilteredResponse);

			const contentPageLabels = await contentPageLabelsController.getContentPageLabelsByType(
				{
					contentType: Lookup_App_Content_Type_Enum.FaqItem,
					labels: [
						"Gebruik van het materiaal"
					]
				}
			);
			expect(contentPageLabels).toEqual(mockContentPageLabelsFilteredResponse);
		});
	});
});