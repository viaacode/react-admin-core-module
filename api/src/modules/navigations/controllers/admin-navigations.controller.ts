import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { groupBy, intersection } from 'lodash';
import { PermissionName } from '@viaa/avo2-types';

import { SessionUser } from '../../shared/decorators/user.decorator';
import { SessionUserEntity } from '../../users/classes/session-user';
import { CreateNavigationDto } from '../dto/navigations.dto';
import { AdminNavigationsService } from '../services/admin-navigations.service';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import {
	DeleteResponse,
	SpecialPermissionGroups,
} from '../../shared/types/types';
import { NavigationItem } from '../navigations.types';

// TODO these routes are currently not used by the admin-core
// Currently the admin core does all navigation manipulations through the data route
// In the long term we would like to switch this to use these routes
@ApiTags('Admin Navigations')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/navigations')
export class AdminNavigationsController {
	constructor(private adminNavigationsService: AdminNavigationsService) {}

	private adapt(navigationItem: NavigationItem): NavigationItem {
		delete navigationItem.userGroupIds;
		return navigationItem;
	}

	private adaptMultiple(navigationItems: NavigationItem[]): NavigationItem[] {
		return navigationItems.map(this.adapt);
	}

	@ApiOperation({
		description: 'Get an overview of all the navigation bars that exist',
	})
	@Get()
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getNavigationBarsOverview(): Promise<NavigationItem[]> {
		return this.adaptMultiple(
			await this.adminNavigationsService.findNavigationBars(),
		);
	}

	@ApiOperation({
		description: 'Get all navigation elements for the current user',
	})
	@Get('items')
	public async getAllNavigationElements(
		@SessionUser() user: SessionUserEntity,
	): Promise<Record<string, NavigationItem[]>> {
		const allNavigationItems =
			await this.adminNavigationsService.findAllNavigationBarItems();

		// filter based on logged in / logged out
		const allowedUserGroups = user
			? [SpecialPermissionGroups.loggedInUsers, user.getGroupId()]
			: [SpecialPermissionGroups.loggedOutUsers];

		const visibleItems: NavigationItem[] = [];
		allNavigationItems.forEach((navigationItem: NavigationItem) => {
			if (navigationItem.userGroupIds?.length) {
				// If the page doesn't have any groups specified, it isn't visible for anyone
				if (
					intersection(allowedUserGroups, navigationItem.userGroupIds).length
				) {
					// The logged-in user has at least one user group that is required to view the nav item
					visibleItems.push(navigationItem);
				}
			}
		});

		return groupBy(this.adaptMultiple(visibleItems), 'placement');
	}

	@ApiOperation({
		description: 'Add one navigation element to a specific navigation bar',
	})
	@Put('items')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async createNavigationElement(
		@Body() createNavigationDto: CreateNavigationDto,
	): Promise<NavigationItem> {
		return this.adapt(
			await this.adminNavigationsService.insertElement(createNavigationDto),
		);
	}

	@ApiOperation({
		description: 'Update an existing navigation element',
	})
	@Patch('items/:id')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async updateNavigationElement(
		@Param('id') id: string,
		@Body() updateNavigationDto: CreateNavigationDto,
	): Promise<NavigationItem> {
		return this.adapt(
			await this.adminNavigationsService.updateElement(id, updateNavigationDto),
		);
	}

	@ApiOperation({
		description:
			'Remove a navigation element. Also deleting it from its navigation bar',
	})
	@Delete('items/:id')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async deleteNavigationElement(
		@Param('id') id: string,
	): Promise<DeleteResponse> {
		return this.adminNavigationsService.deleteElement(id);
	}

	@ApiOperation({
		description: 'Get one navigation element by id',
	})
	@Get('items/:id')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getNavigationElementById(
		@Param('id') id: string,
	): Promise<NavigationItem> {
		return this.adapt(await this.adminNavigationsService.findElementById(id));
	}

	@ApiOperation({
		description: 'Get all items inside one bar by placement id',
	})
	@Get(':placement')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getNavigationBarItemsByPlacement(
		@Param('placement') placement: string,
	): Promise<NavigationItem[]> {
		return this.adaptMultiple(
			await this.adminNavigationsService.findNavigationBarItemsByPlacementId(
				placement,
			),
		);
	}
}
