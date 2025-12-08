import { Body, Controller, Delete, Get, Param, Patch, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';
import { groupBy, intersection } from 'lodash';

import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { SessionUser } from '../../shared/decorators/user.decorator';
import { addPrefix } from '../../shared/helpers/add-route-prefix';
import { DeleteResponse, SpecialPermissionGroups } from '../../shared/types/types';
import { Locale } from '../../translations';
import { SessionUserEntity } from '../../users/classes/session-user';
import { CreateNavigationDto, UpdateNavigationDto } from '../dto/navigations.dto';
import { NavigationItem } from '../navigations.types';
import { AdminNavigationsService } from '../services/admin-navigations.service';

// TODO these routes are currently not used by the admin-core
// Currently the admin core does all navigation manipulations through the data route
// In the long term we would like to switch this to use these routes
@ApiTags('Admin Navigations')
@Controller(addPrefix(process, 'navigations'))
export class AdminNavigationsController {
	constructor(private adminNavigationsService: AdminNavigationsService) {}

	@ApiOperation({
		description: 'Get an overview of all the navigation bars that exist',
	})
	@Get()
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getNavigationBarsOverview(): Promise<NavigationItem[]> {
		return await this.adminNavigationsService.findNavigationBars();
	}

	@ApiOperation({
		description: 'Get all navigation elements for the current user',
	})
	@Get('items')
	public async getAllNavigationElements(
		@SessionUser() user: SessionUserEntity,
		@Query('language') language?: Locale
	): Promise<Record<string, NavigationItem[]>> {
		const allNavigationItems = await this.adminNavigationsService.findAllNavigationBarItems(
			(language || Locale.Nl) as unknown as Locale
		);

		// filter based on logged in / logged out
		const allowedUserGroups = user.getGroupId()
			? [SpecialPermissionGroups.loggedInUsers, user.getGroupId()]
			: [SpecialPermissionGroups.loggedOutUsers];

		const visibleItems: NavigationItem[] = [];
		allNavigationItems.forEach((navigationItem: NavigationItem) => {
			if (navigationItem.userGroupIds?.length) {
				// If the page doesn't have any groups specified, it isn't visible for anyone
				if (
					intersection(
						allowedUserGroups.map((groupId) => String(groupId)),
						navigationItem.userGroupIds.map((groupId) => String(groupId))
					).length
				) {
					// The logged-in user has at least one user group that is required to view the nav item
					visibleItems.push(navigationItem);
				}
			}
		});

		return groupBy(visibleItems, 'placement');
	}

	@ApiOperation({
		description: 'Add one navigation element to a specific navigation bar',
	})
	@Put('items')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async createNavigationElement(
		@Body() createNavigationDto: CreateNavigationDto
	): Promise<NavigationItem> {
		return await this.adminNavigationsService.insertElement(createNavigationDto);
	}

	@ApiOperation({
		description: 'Update an existing navigation element',
	})
	@Patch('items/:id')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async updateNavigationElement(
		@Param('id') id: string,
		@Body() updateNavigationDto: UpdateNavigationDto
	): Promise<NavigationItem> {
		return await this.adminNavigationsService.updateElement(id, updateNavigationDto);
	}

	@ApiOperation({
		description: 'Remove a navigation element. Also deleting it from its navigation bar',
	})
	@Delete('items/:id')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async deleteNavigationElement(@Param('id') id: string): Promise<DeleteResponse> {
		return this.adminNavigationsService.deleteElement(id);
	}

	@ApiOperation({
		description: 'Get one navigation element by id',
	})
	@Get('items/:id')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getNavigationElementById(@Param('id') id: string): Promise<NavigationItem> {
		return await this.adminNavigationsService.findElementById(id);
	}

	@ApiOperation({
		description: 'Get all items inside one bar by placement id',
	})
	@Get(':placement')
	@RequireAnyPermissions(PermissionName.EDIT_NAVIGATION_BARS)
	public async getNavigationBarItemsByPlacement(
		@Param('placement') placement: string,
		@Query('languages') languages?: string, // Comma separated list of LanguageCodes
		@Query('searchTerm') searchTerm?: string,
		@Query('orderProperty') orderProperty?: string,
		@Query('orderDirection') orderDirection?: string
	): Promise<NavigationItem[]> {
		return await this.adminNavigationsService.findNavigationBarItemsByPlacementId(
			placement,
			(languages?.length ? languages.split(',') : []) as Locale[],
			searchTerm,
			orderProperty,
			orderDirection
		);
	}
}
