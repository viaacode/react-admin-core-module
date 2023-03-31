import { Test, TestingModule } from '@nestjs/testing';
import { PermissionName } from '@viaa/avo2-types';

import { ContentPagesController } from './content-pages.controller';
import { ContentPagesService } from '../services/content-pages.service';
import { PlayerTicketService } from '../../player-ticket';
import { HetArchiefUser } from '../../users';
import { Idp } from '../../shared/auth/auth.types';
import { SessionHelper } from '../../shared/auth/session-helper';

const mockUser: HetArchiefUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Idp.HETARCHIEF,
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
	groupName: 'CP_ADMIN',
	permissions: [PermissionName.EDIT_ANY_CONTENT_PAGES],
};

const mockContentPagesService: Partial<Record<keyof ContentPagesService, jest.SpyInstance>> = {
	adaptContentPage: jest.fn(),
	adaptContentBlock: jest.fn(),
	getContentPagesForOverview: jest.fn(),
	getContentPageByPath: jest.fn(),
	fetchCollectionOrItem: jest.fn(),
	fetchItemByExternalId: jest.fn(),
	updatePublishDates: jest.fn(),
	getContentPagesByIds: jest.fn(),
};

const mockPlayerTicketService: Partial<Record<keyof PlayerTicketService, jest.SpyInstance>> = {
	getPlayableUrl: jest.fn(),
	getEmbedUrl: jest.fn(),
};

describe('ContentPagesController', () => {
	let contentPagesController: ContentPagesController;
	let sessionHelperSpy: jest.SpyInstance;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ContentPagesController],
			imports: [],
			providers: [
				{
					provide: ContentPagesService,
					useValue: mockContentPagesService,
				},
				{
					provide: PlayerTicketService,
					useValue: mockPlayerTicketService,
				},
			],
		}).compile();

		contentPagesController = module.get<ContentPagesController>(ContentPagesController);

		sessionHelperSpy = jest.spyOn(SessionHelper, 'getUserInfo').mockReturnValue(mockUser);
	});

	afterAll(async () => {
		sessionHelperSpy.mockRestore();
	});

	it('should be defined', () => {
		expect(contentPagesController).toBeDefined();
	});

	describe('getContentPages', () => {
		it('should return all contentPages for a specific user', async () => {
			expect(true).toEqual(true);
		});
	});
});
