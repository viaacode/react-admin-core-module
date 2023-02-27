import { MaintenanceAlertsQueryDto } from "./maintenance-alerts.dto";

describe('MaintenanceAlertsDto', () => {
	it('should be able to construct a MaintenanceAlertsQueryDto', () => {
		const maintenanceAlertsQueryDto = new MaintenanceAlertsQueryDto();
		expect(maintenanceAlertsQueryDto).toEqual({
			page: 1,
			size: 10,
			orderProp: 'fromDate',
			orderDirection: 'desc',
		});
	});
});
