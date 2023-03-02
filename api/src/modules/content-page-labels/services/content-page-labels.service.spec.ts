import { Test, TestingModule } from "@nestjs/testing";
import { GetContentPageLabelsQuery } from "../../shared/generated/graphql-db-types-hetarchief";
import { DataService } from "../../data";
import { TestingLogger } from "../../shared/logging/test-logger";
import { mockGqlContentPageLabel } from "../mocks/content-page-labels.mocks";
import { ContentPageLabelsService } from "./content-page-labels.service";

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const getDefaultContentPageLabelsRequest = (): {
	app_content_label: GetContentPageLabelsQuery[];
	app_content_label_aggregate: { aggregate: { count: number } };
} => ({
	app_content_label: [mockGqlContentPageLabel as any],
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

			mockDataService.execute.mockResolvedValueOnce(getDefaultContentPageLabelsRequest());
			console.log(getDefaultContentPageLabelsRequest());

			const response = await contentPageLabelsService.fetchContentPageLabels(
				0,
				20,
				'label',
				'asc',
				'{}',
			);
			expect(response[0].length).toBe(1);
			expect(response[0][0].id).toBe(mockGqlContentPageLabel.id);
		});
	});
});
