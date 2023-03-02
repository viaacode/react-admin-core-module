import { Test, TestingModule } from "@nestjs/testing";
import { GetContentPageLabelByIdQuery, GetContentPageLabelsQuery, InsertContentPageLabelMutation, UpdateContentPageLabelMutation } from "../../shared/generated/graphql-db-types-hetarchief";
import { DataService } from "../../data";
import { TestingLogger } from "../../shared/logging/test-logger";
import { mockContentPageLabel1, mockContentPageLabelDto, mockContentPageLabelsResponse, mockGqlContentPageLabel1, mockGqlContentPageLabel2 } from "../mocks/content-page-labels.mocks";
import { ContentPageLabelsService } from "./content-page-labels.service";
import { ContentPageLabelDto } from "../dto/content-page-label.dto";

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const getDefaultContentPageLabelsResponse = (): {
	app_content_label: GetContentPageLabelsQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: [mockGqlContentPageLabel1 as any],
	app_content_label_aggregate: {
		aggregate: {
			count: 100,
		}
	}
})

const getEmptyContentPageLabelsResponse = (): {
	app_content_label: GetContentPageLabelsQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: null,
	app_content_label_aggregate: {
		aggregate: {
			count: 100,
		}
	}
})

const getDefaultContentPageLabelsByIdResponse = (): {
	app_content_label: GetContentPageLabelByIdQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: [mockGqlContentPageLabel2 as any],
	app_content_label_aggregate: {
		aggregate: {
			count: 100,
		}
	}
})

describe('ContentPageLabelsService', () => {
	let contentPageLabelsService: ContentPageLabelsService;
	const env = process.env;

	beforeEach(async () => {
		process.env.DATABASE_APPLICATION_TYPE = 'hetarchief'
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
				'asc',
				'{}',
			);
			expect(response[0].length).toBe(1);
			expect(response[0][0].id).toBe(mockGqlContentPageLabel1.id);
			expect(response[0][0].link_to).toBe(mockGqlContentPageLabel1.link_to);
			expect(response[0][0].label).toBe(mockGqlContentPageLabel1.label);
			expect(response[0][0].content_type).toBe(mockGqlContentPageLabel1.content_type);
		});
		it('should return an error when the response does not contain any content page labels', async () => {
			mockDataService.execute.mockResolvedValueOnce(getEmptyContentPageLabelsResponse());

			const response = await contentPageLabelsService.fetchContentPageLabels(
				0,
				20,
				'label',
				'asc',
				'{}',
			);
			//console.log(response) // expects nog maken
			expect(response)
		});

		// TODO: add test to test case in which an error is thrown
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

			try{
				await contentPageLabelsService.fetchContentPageLabelById(
					'unknown-id'
				);
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});

	describe('insertContentPageLabel', () => {
		it('should insert a content page label', async () => {
			const mockData: InsertContentPageLabelMutation = {
					insert_app_content_label: {
						returning: [mockGqlContentPageLabel1]
					}
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await contentPageLabelsService.insertContentPageLabel(
				mockContentPageLabelDto
			)
			expect(response.id).toBe(mockContentPageLabelDto.id);
			expect(response.label).toBe(mockContentPageLabelDto.label);
			expect(response.content_type).toBe(mockContentPageLabelDto.content_type);
		});

		it('should throw an error when it fails to insert a content page label', async () => {
			const mockData: InsertContentPageLabelMutation = {
					insert_app_content_label: {
						returning: null,
					}
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try{
				await contentPageLabelsService.insertContentPageLabel(
					new ContentPageLabelDto()
				)
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});
	describe('updateContentPageLabel', () => {
		it('should update a content page label', async () => {
			const mockData: UpdateContentPageLabelMutation = {
					update_app_content_label: {
						returning: [mockGqlContentPageLabel1]
					}
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);
			const response = await contentPageLabelsService.updateContentPageLabel(
				mockContentPageLabelDto
			)
			expect(response.id).toBe(mockContentPageLabelDto.id);
			expect(response.label).toBe(mockContentPageLabelDto.label);
			expect(response.content_type).toBe(mockContentPageLabelDto.content_type);
		});

		it('should throw an error when it fails to update a content page label', async () => {
			const mockData: UpdateContentPageLabelMutation = {
					update_app_content_label: {
						returning: null,
					}
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try{
				await contentPageLabelsService.updateContentPageLabel(
					new ContentPageLabelDto()
				)
			} catch (error) {
				expect(error).toBeDefined();
			}
		});
	});

});
