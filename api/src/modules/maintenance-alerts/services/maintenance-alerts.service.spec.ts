import { Test, TestingModule } from '@nestjs/testing';
import {
	DeleteMaintenanceAlertMutation,
	FindMaintenanceAlertByIdQuery,
	FindMaintenanceAlertsQuery,
	InsertMaintenanceAlertMutation,
	UpdateMaintenanceAlertMutation,
} from 'src/modules/shared/generated/graphql-db-types-hetarchief';
import { DataService } from '../../data';
import { TestingLogger } from '../../shared/logging/test-logger';
import { MaintenanceAlertType } from '../maintenance-alerts.types';
import {
	mockGqlMaintenanceAlert1,
	mockGqlMaintenanceAlert2,
	mockMaintenanceAlert1,
	mockNewMaintenanceAlert,
} from '../mocks/maintenance-alerts.mocks';
import { MaintenanceAlertsService } from './maintenance-alerts.service';

const mockDataService: Partial<Record<keyof DataService, jest.SpyInstance>> = {
	execute: jest.fn(),
};

const getDefaultMaintenanceAlertsResponse = (): {
	app_maintenance_alerts: FindMaintenanceAlertsQuery[];
	app_maintenance_alerts_aggregate: { aggregate: { count: number } };
} => ({
	app_maintenance_alerts: [mockGqlMaintenanceAlert1 as any],
	app_maintenance_alerts_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

const getDefaultMaintenanceAlertsByIdResponse = (): {
	app_maintenance_alerts: FindMaintenanceAlertByIdQuery[];
	app_maintenance_alerts_aggregate: { aggregate: { count: number } };
} => ({
	app_maintenance_alerts: [mockGqlMaintenanceAlert2 as any],
	app_maintenance_alerts_aggregate: {
		aggregate: {
			count: 100,
		},
	},
});

describe('MaintenanceAlertsService', () => {
	let maintenanceAlertsService: MaintenanceAlertsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MaintenanceAlertsService,
				{
					provide: DataService,
					useValue: mockDataService,
				},
			],
		})
			.setLogger(new TestingLogger())
			.compile();

		maintenanceAlertsService = module.get<MaintenanceAlertsService>(
			MaintenanceAlertsService,
		);
	});

	afterEach(() => {
		mockDataService.execute.mockRestore();
	});

	it('services should be defined', () => {
		expect(maintenanceAlertsService).toBeDefined();
	});

	describe('adapt', () => {
		it('can adapt a FindMaintenanceAlertsQuery hasura response to our maintenance alert class', () => {
			const adapted = maintenanceAlertsService.adapt(mockGqlMaintenanceAlert1);

			expect(adapted.id).toEqual(mockGqlMaintenanceAlert1.id);
			expect(adapted.title).toEqual(mockGqlMaintenanceAlert1.title);
			expect(adapted.message).toEqual(mockGqlMaintenanceAlert1.message);
			expect(adapted.type).toEqual(mockGqlMaintenanceAlert1.type);
			expect(adapted.fromDate).toEqual(mockGqlMaintenanceAlert1.from_date);
			expect(adapted.untilDate).toEqual(mockGqlMaintenanceAlert1.until_date);
			expect(adapted.userGroups).toEqual(mockGqlMaintenanceAlert1.user_groups);
		});

		it('can adapt a personal FindMaintenanceAlertsQuery hasura response to our maintenance alert class', () => {
			const adapted = maintenanceAlertsService.adapt(
				mockGqlMaintenanceAlert1,
				true,
			);

			expect(adapted.id).toEqual(mockGqlMaintenanceAlert1.id);
			expect(adapted.title).toEqual(mockGqlMaintenanceAlert1.title);
			expect(adapted.message).toEqual(mockGqlMaintenanceAlert1.message);
			expect(adapted.type).toEqual(mockGqlMaintenanceAlert1.type);
			expect(adapted.fromDate).toEqual(mockGqlMaintenanceAlert1.from_date);
			expect(adapted.untilDate).toEqual(mockGqlMaintenanceAlert1.until_date);
			expect(adapted.userGroups).toEqual(undefined);
		});

		it('returns null when the maintenance alert does not exist', () => {
			const adapted = maintenanceAlertsService.adapt(undefined);
			expect(adapted).toBeNull();
		});

		it('returns null on invalid input', () => {
			const adapted = maintenanceAlertsService.adapt(null);
			expect(adapted).toBeNull();
		});
	});

	describe('findAll', () => {
		it('returns a paginated response with all maintenance alerts', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				getDefaultMaintenanceAlertsResponse(),
			);

			const response = await maintenanceAlertsService.findAll({
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on fromDate', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				getDefaultMaintenanceAlertsResponse(),
			);

			const response = await maintenanceAlertsService.findAll({
				fromDate: '2022-02-24T16:36:06.045845',
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.fromDate).toBe(mockMaintenanceAlert1.fromDate);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on untilDate', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				getDefaultMaintenanceAlertsResponse(),
			);

			const response = await maintenanceAlertsService.findAll({
				untilDate: '2022-02-27T16:36:06.045845',
				page: 1,
				size: 10,
			});
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.untilDate).toBe(
				mockMaintenanceAlert1.untilDate,
			);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});

		it('can filter on userGroups', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				getDefaultMaintenanceAlertsResponse(),
			);

			const response = await maintenanceAlertsService.findAll(
				{
					page: 1,
					size: 10,
				},
				{
					userGroupIds: [
						'0213c8d4-f459-45ef-8bbc-96268ab56d01',
						'04150e6e-b779-4125-84e5-6ee6fc580757',
						'0b281484-76cd-45a9-b6ce-68a0ea7f4b26',
						'c56d95aa-e918-47ca-b102-486c9449fc4a',
					],
					isPersonal: true,
				},
			);
			expect(response.items.length).toBe(1);
			expect(response.items[0]?.id).toBe(mockMaintenanceAlert1.id);
			expect(response.items[0]?.title).toBe(mockMaintenanceAlert1.title);
			expect(response.page).toBe(1);
			expect(response.size).toBe(10);
			expect(response.total).toBe(100);
		});
	});

	describe('findById', () => {
		it('returns a single maintenance alert', async () => {
			mockDataService.execute.mockResolvedValueOnce(
				getDefaultMaintenanceAlertsByIdResponse(),
			);
			const response = await maintenanceAlertsService.findById('1');
			expect(response.id).toBe(mockGqlMaintenanceAlert2.id);
		});

		it('throws a notfoundexception if the material request was not found', async () => {
			const mockData: FindMaintenanceAlertsQuery = {
				app_maintenance_alerts: [],
				app_maintenance_alerts_aggregate: {
					aggregate: {
						count: 0,
					},
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			try {
				await maintenanceAlertsService.findById('unknown-id');
			} catch (error) {
				expect(error.response).toEqual({
					error: 'Not Found',
					message: "Maintenance Alert with id 'unknown-id' not found",
					statusCode: 404,
				});
			}
		});
	});

	describe('create', () => {
		it('can create a new maintenance alert', async () => {
			const mockData: InsertMaintenanceAlertMutation = {
				insert_app_maintenance_alerts_one: mockGqlMaintenanceAlert1,
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await maintenanceAlertsService.createMaintenanceAlert(
				mockNewMaintenanceAlert,
			);
			expect(response.id).toBe(mockGqlMaintenanceAlert1.id);
		});
	});

	describe('update', () => {
		it('can update a new maintenance alert', async () => {
			const mockData: UpdateMaintenanceAlertMutation = {
				update_app_maintenance_alerts: {
					returning: [mockGqlMaintenanceAlert1],
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const response = await maintenanceAlertsService.updateMaintenanceAlert(
				mockGqlMaintenanceAlert1.id,
				{
					title: 'Gepland onderhoud updated',
					type: MaintenanceAlertType.QUESTION,
				},
			);
			expect(response.id).toBe(mockGqlMaintenanceAlert1.id);
		});
	});

	describe('delete', () => {
		it('can delete a maintenance alert', async () => {
			const mockData: DeleteMaintenanceAlertMutation = {
				delete_app_maintenance_alerts: {
					affected_rows: 1,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const affectedRows =
				await maintenanceAlertsService.deleteMaintenanceAlert(
					mockGqlMaintenanceAlert1.id,
				);
			expect(affectedRows).toBe(1);
		});

		it('can delete a non existing maintenance alert', async () => {
			const mockData: DeleteMaintenanceAlertMutation = {
				delete_app_maintenance_alerts: {
					affected_rows: 0,
				},
			};
			mockDataService.execute.mockResolvedValueOnce(mockData);

			const affectedRows =
				await maintenanceAlertsService.deleteMaintenanceAlert('unknown-id');
			expect(affectedRows).toBe(0);
		});
	});
});
