import { MaintenanceAlertOrderProp } from '../maintenance-alerts.types'

import {
	CreateMaintenanceAlertDto,
	MaintenanceAlertsQueryDto,
	UpdateMaintenanceAlertDto,
} from './maintenance-alerts.dto'

import { SortDirection } from 'src/modules/shared/types/sorting'

describe('MaintenanceAlertsDto', () => {
	describe('MaintenanceAlertsQueryDto', () => {
		it('should be able to construct a MaintenanceAlertsQueryDto object', () => {
			const maintenanceAlertsQueryDto = new MaintenanceAlertsQueryDto()
			expect(maintenanceAlertsQueryDto).toEqual({
				page: 1,
				size: 10,
				orderProp: MaintenanceAlertOrderProp.FROM_DATE,
				orderDirection: SortDirection.desc,
			})
		})
	})

	describe('CreateMaintenanceAlertDto', () => {
		it('should be able to construct a CreateMaintenanceAlertDto object', () => {
			const createMaintenanceAlertDto = new CreateMaintenanceAlertDto()
			expect(createMaintenanceAlertDto).toEqual({})
		})
	})

	describe('UpdateMaintenanceAlertDto', () => {
		it('should be able to construct an UpdateMaintenanceAlertDto object', () => {
			const updateMaintenanceAlertDto = new UpdateMaintenanceAlertDto()
			expect(updateMaintenanceAlertDto).toEqual({})
		})
	})
})
