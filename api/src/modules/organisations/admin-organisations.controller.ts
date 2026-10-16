import { addPrefix } from '../shared/helpers/add-route-prefix';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';

import { BasicOrganisation } from './admin-organisations.types';
import { AdminOrganisationsService } from './services/admin-organisations.service';

@ApiTags('Organisations')
@Controller(addPrefix(process, 'organisations'))
export class AdminOrganisationsController {
	constructor(protected adminOrganisationsService: AdminOrganisationsService) {}

	@Get('with-users')
	@RequireAnyPermissions(PermissionName.VIEW_USERS)
	public async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		return this.adminOrganisationsService.fetchOrganisationsWithUsers();
	}
}
