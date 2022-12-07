import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';
import { Permission } from '../users';
import { BasicOrganisation } from './admin-organisations.types';
import { AdminOrganisationsService } from './services/admin-organisations.service';

@ApiTags('Organisations')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/organisations')
export class AdminOrganisationsController {
	constructor(protected adminOrganisationsService: AdminOrganisationsService) {}

	@Get('with-users')
	@RequireAnyPermissions(Permission.VIEW_USERS)
	public async fetchOrganisationsWithUsers(): Promise<BasicOrganisation[]> {
		return this.adminOrganisationsService.fetchOrganisationsWithUsers();
	}
}
