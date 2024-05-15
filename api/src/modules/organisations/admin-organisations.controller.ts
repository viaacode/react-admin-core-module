import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';

import { BasicOrganisation } from './admin-organisations.types';
import { AdminOrganisationsService } from './services/admin-organisations.service';

@ApiTags('Organisations')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/organisations')
export class AdminOrganisationsController {
	constructor(protected adminOrganisationsService: AdminOrganisationsService) {}

	@Get('with-users')
	@RequireAnyPermissions(PermissionName.VIEW_USERS)
	public async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		return this.adminOrganisationsService.fetchOrganisationsWithUsers();
	}

	@Get('maintainer-grid')
	public async fetchOrganisationsForMaintainerGrid(@Query('limit') limit: number): Promise<any> {
		return this.adminOrganisationsService.fetchOrganisationsForMaintainerGrid(limit);
	}
}
