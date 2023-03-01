import { Test, TestingModule } from '@nestjs/testing';
import { TestingLogger } from '../../shared/logging/test-logger';
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

	it('should be defined', () => {
		expect(contentPageLabelsController).toBeDefined();
	})
});
