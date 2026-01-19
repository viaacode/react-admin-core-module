import { Test, type TestingModule } from '@nestjs/testing';
import { AvoCoreDatabaseType, AvoSearchOrderDirection } from '@viaa/avo2-types';
import { vi, type MockInstance } from 'vitest';

import { DataService } from '../../data';
import {
	type GetContentPageLabelByIdQuery,
	type GetContentPageLabelsByTypeAndIdsQuery,
	type GetContentPageLabelsByTypeAndLabelsQuery,
	type GetContentPageLabelsQuery,
	type InsertContentPageLabelMutation,
	Lookup_App_Content_Type_Enum,
	type UpdateContentPageLabelMutation,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { TestingLogger } from '../../shared/logging/test-logger';
import { ContentPageLabelDto } from '../dto/content-page-label.dto';
import {
	mockContentPageLabel1,
	mockContentPageLabelDto,
	mockGqlContentPageLabel1,
	mockGqlContentPageLabel2,
	mockLabelObj,
} from '../mocks/content-page-labels.mocks';

import { ContentPageLabelsService } from './content-page-labels.service';

const mockDataService: Partial<Record<keyof DataService, MockInstance>> = {
	execute: vi.fn(),
};

const getDefaultContentPageLabelsResponse = (): {
	app_content_label: GetContentPageLabelsQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: [mockGqlContentPageLabel1 as any],
	app_content_label_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

const getEmptyContentPageLabelsResponse = (): {
	app_content_label: GetContentPageLabelsQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: null,
	app_content_label_aggregate: {
		aggregate: {
			count: 0,
		},
	},
});

const getDefaultContentPageLabelsByIdResponse = (): {
	app_content_label: GetContentPageLabelByIdQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: [mockGqlContentPageLabel2 as any],
	app_content_label_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

describe('ContentPageLabelsService', () => {
	let contentPageLabelsService: ContentPageLabelsService;
	const env = process.env;

	beforeEach(async () => {
		process.env.DATABASE_APPLICATION_TYPE = AvoCoreDatabaseType.hetArchief;
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ContentPageLabelsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		contentPageLabelsService = module.get<ContentPageLabelsService>(ContentPageLabelsService);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();

		process.env = env;
	});

	it('services should be defined', () => {
		expect(contentPageLabelsService).toBeDefined();
	});

	describe('fetchContentPageLabels', () => {
		it('should return all content page labels', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultContentPageLabelsResponse());

			const response = await contentPageLabelsService.fetchContentPageLabels(
				0,
				20,
				'label',
				AvoSearchOrderDirection.ASC,
				'{}'
			);
			expect(response[0].length).toBe(1);
			expect(response[0][0].id).toBe(mockGqlContentPageLabel1.id);
			expect(response[0][0].link_to).toBe(mockGqlContentPageLabel1.link_to);
			expect(response[0][0].label).toBe(mockGqlContentPageLabel1.label);
			expect(response[0][0].content_type).toBe(mockGqlContentPageLabel1.content_type);
		});
		it('should return an error when the response fails to get content page labels', async () => {
			mockDataService.execute.mockRejectedValueOnce(getEmptyContentPageLabelsResponse());

			try {
				const response = await contentPageLabelsService.fetchContentPageLabels(
					0,
					20,
					'label',
					AvoSearchOrderDirection.ASC,
					'{}'
				);
				expect(response).toBeUndefined();
			} catch (error: any) {
				expect(error).toBeDefined();
				expect(error.response.message).toContain(
					'Failed to get content page labels from the database'
				);
			}
		});
		//TODO: add test where the database returns nothing
	});
	describe('fetchContentPageLabelById', () => {
		it('should return a content page label', async () => {
			mockDataService.execute.mockResolvedValueOnce(getDefaultContentPageLabelsByIdResponse());

			const response = await contentPageLabelsService.fetchContentPageLabelById(
				mockGqlContentPageLabel2.id
			);
			expect(response.id).toBe(mockGqlContentPageLabel2.id);
			expect(response.link_to).toBe(mockGqlContentPageLabel2.link_to);
			expect(response.label).toBe(mockGqlContentPageLabel2.label);
			expect(response.content_type).toBe(mockGqlContentPageLabel2.content_type);
		});
		it('should throw an error when no content page label is found', async () => {
			mockDataService.execute.mockResolvedValueOnce(getEmptyContentPageLabelsResponse());

			try {
				await contentPageLabelsService.fetchContentPageLabelById('unknown-id');
				fail(new Error('fetchContentPageLabelById should have thrown an error for unknown ids'));
			} catch (error: any) {
				expect(error).toBeDefined();
				expect(error.response.message).toEqual(
					'Failed to get content page labels from the database'
				);
				expect(error.response.innerException.response.message).toEqual(
					'Response does not contain any content page labels'
				);
			}
		});
	});

	describe('insertContentPageLabel', () => {
		it('should insert a content page label', async () => {
			const mockData: InsertContentPageLabelMutation = {
				insert_app_content_label: {
					returning: [mockGqlContentPageLabel1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await contentPageLabelsService.insertContentPageLabels([
				mockContentPageLabelDto,
			]);
			expect(response[0].id).toBe(mockContentPageLabelDto.id);
			expect(response[0].label).toBe(mockContentPageLabelDto.label);
			expect(response[0].content_type).toBe(mockContentPageLabelDto.content_type);
		});

		it('should throw an error when it fails to insert a content page label', async () => {
			const mockData: InsertContentPageLabelMutation = {
				insert_app_content_label: {
					returning: null,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try {
				await contentPageLabelsService.insertContentPageLabels([new ContentPageLabelDto()]);
				fail(new Error('insertContentPageLabel should have thrown an error when null is returned'));
			} catch (error: any) {
				expect(error).toBeDefined();
				expect(error.response.message).toEqual(
					'Failed to insert content page label in the database'
				);
				expect(error.response.innerException.response.message).toEqual(
					'Response from database does not contain the id of the inserted content page label'
				);
			}
		});
	});

	describe('updateContentPageLabel', () => {
		it('should update a content page label', async () => {
			const mockData: UpdateContentPageLabelMutation = {
				update_app_content_label: {
					returning: [mockGqlContentPageLabel1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response =
				await contentPageLabelsService.updateContentPageLabel(mockContentPageLabelDto);
			expect(response.id).toBe(mockContentPageLabelDto.id);
			expect(response.label).toBe(mockContentPageLabelDto.label);
			expect(response.content_type).toBe(mockContentPageLabelDto.content_type);
		});

		it('should throw an error when it fails to update a content page label', async () => {
			const mockData: UpdateContentPageLabelMutation = {
				update_app_content_label: {
					returning: null,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try {
				await contentPageLabelsService.updateContentPageLabel(new ContentPageLabelDto());
				fail(new Error('updateContentPageLabel should have thrown an error when null is returned'));
			} catch (error: any) {
				expect(error).toBeDefined();
				expect(error.response.message).toEqual(
					'Failed to update content page label in the database'
				);
				expect(error.response.innerException.response.message).toEqual(
					'Response from database does not contain the id of the inserted content page label'
				);
			}
		});
	});

	describe('deleteContentPageLabel', () => {
		it('should delete a content page label', async () => {
			mockDataService.execute.mockResolvedValueOnce(true);

			try {
				await contentPageLabelsService.deleteContentPageLabel(mockContentPageLabel1.id.toString());
			} catch (error: any) {
				expect(error).toBeUndefined();
			}
		});

		it('should throw an error when failing to delete a content page label', async () => {
			mockDataService.execute.mockRejectedValueOnce(false);

			try {
				await contentPageLabelsService.deleteContentPageLabel('unknown-id');
			} catch (error: any) {
				expect(error).toBeDefined();
				expect(error.response.message).toEqual(
					'Failed to delete content page label from the database'
				);
			}
		});
	});

	describe('getContentPageLabelsByTypeAndLabels', () => {
		it('should get a content page label', async () => {
			const mockData: GetContentPageLabelsByTypeAndLabelsQuery = {
				app_content_label: [mockLabelObj],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await contentPageLabelsService.getContentPageLabelsByTypeAndLabels(
				Lookup_App_Content_Type_Enum.FaqItem,
				[mockContentPageLabel1.label]
			);
			expect(response[0].id).toEqual(mockLabelObj.id);
			expect(response[0].label).toEqual(mockLabelObj.label);
		});
	});

	describe('getContentPageLabelsByTypeAndIds', () => {
		it('should get a content page label', async () => {
			const mockData: GetContentPageLabelsByTypeAndIdsQuery = {
				app_content_label: [mockLabelObj],
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await contentPageLabelsService.getContentPageLabelsByTypeAndIds(
				Lookup_App_Content_Type_Enum.FaqItem,
				[mockContentPageLabel1.id]
			);
			expect(response[0].id).toEqual(mockLabelObj.id);
			expect(response[0].label).toEqual(mockLabelObj.label);
		});
	});
});
