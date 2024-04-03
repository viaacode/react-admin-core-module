import { Test, type TestingModule } from '@nestjs/testing';

import { DataService } from '../../data';
import { SpecialPermissionGroups } from '../../shared/types/types';
import { type NavigationQueryTypes } from '../queries/navigation.queries';

import { AdminNavigationsService } from './admin-navigations.service';

const mockNavigationElement1 = {
	content_path: '/gebruiksvoorwaarden',
	content_type: 'INTERNAL_LINK',
	link_target: null,
	placement: 'footer_center',
	position: 1,
	id: '42555c7e-1cf7-4031-bb17-e6ca57eaab64',
	icon_name: '',
	user_group_ids: [SpecialPermissionGroups.loggedOutUsers, SpecialPermissionGroups.loggedInUsers],
	label: 'Gebruikersvoorwaarden',
	updated_at: '2022-02-21T16:36:06.045845+00:00',
	description: 'Navigatie balk in de footer gecentreerd',
	created_at: '2022-02-21T16:36:06.045845+00:00',
	content_id: null,
	tooltip: null,
};

const mockNavigationElement2 = {
	content_path: '/over-leeszalen',
	content_type: 'INTERNAL_LINK',
	link_target: null,
	placement: 'header_left',
	position: 1,
	id: '7f8c1140-d52e-4f12-8437-6176392f64db',
	icon_name: '',
	user_group_ids: [SpecialPermissionGroups.loggedInUsers],
	label: 'Over de leeszalen',
	updated_at: '2022-02-21T16:35:08.635696+00:00',
	description: 'Hoofd navigatie balk bovenaan de pagina linker zijde',
	created_at: '2022-02-21T16:35:08.635696+00:00',
	content_id: null,
	tooltip: null,
};

const mockNavigationElement3 = {
	content_path: '/faq',
	content_type: 'INTERNAL_LINK',
	link_target: null,
	placement: 'header_left',
	position: 2,
	id: 'f3b279b0-8c30-48cd-82ce-7b184180d890',
	icon_name: '',
	user_group_ids: null,
	label: 'Vaak gestelde vragen',
	updated_at: '2022-02-21T16:35:25.554254+00:00',
	description: 'Hoofd navigatie balk bovenaan de pagina linker zijde',
	created_at: '2022-02-21T16:35:25.554254+00:00',
	content_id: null,
	tooltip: null,
};

const mockDataService = {
	execute: jest.fn(),
};

describe('NavigationsService', () => {
	let navigationsService: AdminNavigationsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AdminNavigationsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		}).compile();

		navigationsService = module.get<AdminNavigationsService>(AdminNavigationsService);
	});

	it('services should be defined', () => {
		expect(navigationsService).toBeDefined();
	});

	it('should adapt navigation to client side object', () => {
		const navigationInfo = navigationsService.adapt(mockNavigationElement1);
		expect(navigationInfo).toBeDefined();
		expect(navigationInfo.id).toEqual(mockNavigationElement1.id);
		expect(navigationInfo.contentPath).toEqual(mockNavigationElement1.content_path);
	});

	it('returns a paginated response with all navigations by placement', async () => {
		const mockData: NavigationQueryTypes['GetNavigationItemsByPlacementQueryHetArchief'] = {
			app_navigation: [
				mockNavigationElement1,
			] as NavigationQueryTypes['GetNavigationItemsByPlacementQueryHetArchief']['app_navigation'],
		};
		mockDataService.execute.mockResolvedValueOnce({ data: mockData });
		const response = await navigationsService.findNavigationBarItemsByPlacementId(
			mockNavigationElement1.placement
		);
		expect(response.length).toBe(1);
		expect(response[0].placement).toEqual(mockNavigationElement1.placement);
	});

	describe('findById', () => {
		it('returns a single navigation', async () => {
			const mockData: NavigationQueryTypes['GetNavigationItemByIdQueryHetArchief'] = {
				app_navigation: [
					mockNavigationElement1,
				] as NavigationQueryTypes['GetNavigationItemByIdQueryHetArchief']['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.findElementById(mockNavigationElement1.id);
			expect(response.id).toBe(mockNavigationElement1.id);
		});

		it('throws a notfoundexception if the navigation was not found', async () => {
			const mockData: NavigationQueryTypes['GetNavigationItemByIdQuery'] = {
				app_navigation:
					[] as NavigationQueryTypes['GetNavigationItemByIdQueryHetArchief']['app_navigation'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			let error;
			try {
				await navigationsService.findElementById('unknown-id');
			} catch (e) {
				error = e;
			}
			expect(error.response).toEqual({
				message: 'Not Found',
				statusCode: 404,
			});
		});
	});

	describe('create', () => {
		it('can create a new navigation', async () => {
			const mockData: NavigationQueryTypes['InsertNavigationItemMutation'] = {
				insert_app_navigation_one: {
					id: '1',
					icon_name: 'plus',
				} as NavigationQueryTypes['InsertNavigationItemMutationHetArchief']['insert_app_navigation_one'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.insertElement({
				label: 'test-create-nav',
				iconName: 'plus',
				placement: 'footer-links',
				position: 1,
			});
			expect(response.id).toBe('1');
			expect(response.iconName).toBe('plus');
		});
	});

	describe('update', () => {
		it('can update an existing navigation', async () => {
			const mockData: NavigationQueryTypes['UpdateNavigationItemByIdMutation'] = {
				update_app_navigation_by_pk: {
					id: '1',
					icon_name: 'plus',
				} as NavigationQueryTypes['UpdateNavigationItemByIdMutationHetArchief']['update_app_navigation_by_pk'],
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.updateElement('1', {
				label: 'test-create-nav',
				iconName: 'plus',
				placement: 'footer-links',
				position: 1,
			});
			expect(response.id).toBe('1');
			expect(response.iconName).toBe('plus');
		});
	});

	describe('delete', () => {
		it('can delete a navigation', async () => {
			const mockData: NavigationQueryTypes['DeleteNavigationItemMutation'] = {
				delete_app_navigation: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce({ data: mockData });
			const response = await navigationsService.deleteElement('1');
			expect(response.affectedRows).toBe(1);
		});
	});
});
