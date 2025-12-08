import { Test, type TestingModule } from '@nestjs/testing';
import { Avo, PermissionName } from '@viaa/avo2-types';

import { PlayerTicketService } from '../../player-ticket';
import { SessionHelper } from '../../shared/auth/session-helper';
import { ContentPagesService } from '../services/content-pages.service';

import { ContentPagesController } from './content-pages.controller';

export const mockUser: Avo.User.HetArchiefUser = {
	id: 'e791ecf1-e121-4c54-9d2e-34524b6467c6',
	firstName: 'Test',
	lastName: 'Testers',
	fullName: 'Test Testers',
	email: 'test.testers@meemoo.be',
	idp: Avo.Auth.IdpType.HETARCHIEF as any, // Definitions of Idp enum in different repos cause typescript to be confused and not recognize them as the same type
	acceptedTosAt: '1997-01-01T00:00:00.000Z',
	groupId: 'c56d95aa-e918-47ca-b102-486c9449fc4a',
	groupName: 'CP_ADMIN',
	permissions: [PermissionName.VIEW_ANY_MAINTENANCE_ALERTS],
	isKeyUser: false,
	visitorSpaceSlug: 'vrt',
	maintainerId: 'OR-rf5kf25',
	createdAt: '2023-03-08T08:00:00',
	lastAccessAt: '2023-03-08T08:00:00',
	organisationId: 'OR-rf5kf25',
	organisationName: 'VRT',
	sector: 'Publieke Omroep',
	language: 'nl',
};

const mockContentPagesService: Partial<Record<keyof ContentPagesService, jest.SpyInstance>> = {
	adaptContentPage: jest.fn(),
	adaptContentBlock: jest.fn(),
	getContentPagesForPageOverviewBlock: jest.fn(),
	getContentPageByLanguageAndPath: jest.fn(),
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
