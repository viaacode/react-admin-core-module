import { Test, TestingModule } from "@nestjs/testing";
import { DataService } from "../../data";
import { TestingLogger } from "../../shared/logging/test-logger";
import { ContentPageLabelsService } from "./content-page-labels.service";

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

describe('ContentPageLabelsService', () => {
	let contentPageLabelsService: ContentPageLabelsService;

	beforeEach(async () => {
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
	});

	describe('deleteContentPageLabel', () => {

	});
});
