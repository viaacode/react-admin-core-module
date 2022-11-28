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

import { CreateNavigationDto } from '../dto/navigations.dto';
import { AdminNavigationsService } from '../services/admin-navigations.service';

import { Permission } from '../../users/users.types';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';
import { DeleteResponse } from '../../shared/types/types';
import { NavigationItem } from '../types';

// TODO these routes are currently not used by the admin-core
// Currently the admin core does all navigation manipulations through the data route
// In the long term we would like to switch this to use these routes
@ApiTags('Admin Navigations')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/navigations')
@RequireAnyPermissions(Permission.EDIT_NAVIGATION_BARS)
export class AdminNavigationsController {
	constructor(private navigationsService: AdminNavigationsService) {}

	@ApiOperation({
		description: 'Get an overview of all the navigation bars that exist',
	})
	@Get()
	public async getNavigationBarsOverview(): Promise<NavigationItem[]> {
		return this.navigationsService.findNavigationBars();
	}

	@ApiOperation({
		description: 'Get all items inside one bar by placement id',
	})
	@Get(':placement')
	public async getNavigationBarItems(
		@Param('placement') placement: string,
	): Promise<NavigationItem[]> {
		return this.navigationsService.findNavigationBarItemsByPlacementId(
			placement,
		);
	}

	@ApiOperation({
		description: 'Get one navigation element by id',
	})
	@Get('items/:id')
	public async getNavigationElement(
		@Param('id') id: string,
	): Promise<NavigationItem> {
		return this.navigationsService.findElementById(id);
	}

	@ApiOperation({
		description: 'Add one navigation element to a specific navigation bar',
	})
	@Put('items')
	public async createNavigationElement(
		@Body() createNavigationDto: CreateNavigationDto,
	): Promise<NavigationItem> {
		return this.navigationsService.insertElement(createNavigationDto);
	}

	@ApiOperation({
		description: 'Update an existing navigation element',
	})
	@Patch('items/:id')
	public async updateNavigationElement(
		@Param('id') id: string,
		@Body() updateNavigationDto: CreateNavigationDto,
	): Promise<NavigationItem> {
		return this.navigationsService.updateElement(id, updateNavigationDto);
	}

	@ApiOperation({
		description:
			'Remove a navigation element. Also deleting it from its navigation bar',
	})
	@Delete('items/:id')
	public async deleteNavigationElement(
		@Param('id') id: string,
	): Promise<DeleteResponse> {
		return this.navigationsService.deleteElement(id);
	}
}
