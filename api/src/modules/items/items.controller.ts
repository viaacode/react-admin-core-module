import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
	type AvoCollectionCollection,
	type AvoCollectionRelationEntry,
	type AvoCollectionRelationType,
	type AvoItemItem,
	PermissionName,
} from '@viaa/avo2-types';

import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';

import { ItemsService } from './items.service';

@ApiTags('Items')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/items')
export class ItemsController {
	constructor(protected itemsService: ItemsService) {}

	@Get('')
	@RequireAnyPermissions(
		PermissionName.VIEW_ANY_PUBLISHED_ITEMS,
		PermissionName.EDIT_CONTENT_PAGE_LABELS,
		PermissionName.PUBLISH_ITEMS
	)
	public async fetchPublicItems(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('titleOrExternalId') titleOrExternalId: string | undefined
	): Promise<AvoItemItem[] | null> {
		if (!titleOrExternalId) {
			return this.itemsService.fetchPublicItems(limit);
		} else {
			return this.itemsService.fetchPublicItemsByTitleOrExternalId(titleOrExternalId, limit);
		}
	}

	@Get('relations')
	@RequireAnyPermissions(PermissionName.VIEW_ANY_PUBLISHED_ITEMS)
	public async fetchRelationsBySubject(
		@Query('type') type: 'collection' | 'item',
		@Query('subjectIds') subjectIds: string[],
		@Query('relationType') relationType: AvoCollectionRelationType
	): Promise<AvoCollectionRelationEntry<AvoItemItem | AvoCollectionCollection>[]> {
		return this.itemsService.fetchRelationsBySubject(type, subjectIds, relationType);
	}

	// Allowed for all users
	@ApiOperation({
		description:
			'Get the item uuid (eg: 7c493caf-1ec4-4900-a4bd-0e5a98ab8244) by its external id (eg: 3b5w69xc4k)',
	})
	@ApiResponse({
		status: 200,
		description: 'The uuid of the item',
	})
	@Get('ids')
	public async fetchItemUuidByExternalId(
		@Query('externalId') externalId: string
	): Promise<string | null> {
		return this.itemsService.fetchItemUuidByExternalId(externalId);
	}

	@ApiOperation({ description: 'Get one media item by externalId or uuid' })
	@ApiResponse({
		status: 200,
		description: 'Returns the item that was requested, throws an error if the item was not found',
		isArray: false,
	})
	@Get(':id')
	public async fetchItemByUuidOrExternalId(@Param('id') id: string): Promise<Partial<AvoItemItem>> {
		return this.itemsService.fetchItemOrReplacement(id);
	}
}
