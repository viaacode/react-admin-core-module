import {
	CreateMaintenanceAlertDto,
	MaintenanceAlertsQueryDto,
	UpdateMaintenanceAlertDto,
} from './maintenance-alerts.dto';

describe('MaintenanceAlertsDto', () => {
	describe('MaintenanceAlertsQueryDto', () => {
		it('should be able to construct a MaintenanceAlertsQueryDto object', () => {
			const maintenanceAlertsQueryDto = new MaintenanceAlertsQueryDto();
			expect(maintenanceAlertsQueryDto).toEqual({
				page: 1,
				size: 10,
				orderProp: 'fromDate',
				orderDirection: 'desc',
			});
		});
	});

	describe('CreateMaintenanceAlertDto', () => {
		it('should be able to construct a CreateMaintenanceAlertDto object', () => {
			const createMaintenanceAlertDto = new CreateMaintenanceAlertDto();
			expect(createMaintenanceAlertDto).toEqual({});
		});
	});

	describe('UpdateMaintenanceAlertDto', () => {
		it('should be able to construct a UpdateMaintenanceAlertDto object', () => {
			const updateMaintenanceAlertDto = new UpdateMaintenanceAlertDto();
			expect(updateMaintenanceAlertDto).toEqual({});
		});
	});
});
