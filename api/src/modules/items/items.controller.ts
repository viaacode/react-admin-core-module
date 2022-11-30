import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';
import { RelationEntry, RelationType } from '@viaa/avo2-types/types/collection';
import { RequireAnyPermissions } from '../shared/decorators/require-any-permissions.decorator';

import { Permission } from '../users';
import { ItemsService } from './items.service';

@ApiTags('Items')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/items')
export class ItemsController {
	constructor(@Inject() protected itemsService: ItemsService) {}

	@Get(':id')
	public async fetchItemByUuidOrExternalId(
		@Param('id') id: string,
	): Promise<Partial<Avo.Item.Item>> {
		return this.itemsService.fetchItemOrReplacement(id);
	}

	@Get('')
	@RequireAnyPermissions(
		Permission.VIEW_ANY_PUBLISHED_ITEMS,
		Permission.EDIT_CONTENT_PAGE_LABELS,
		Permission.PUBLISH_ITEMS,
	)
	public async fetchPublicItems(
		@Query('limit') limit: number,
		@Query('titleOrExternalId') titleOrExternalId: string | undefined,
	): Promise<Avo.Item.Item[] | null> {
		if (!titleOrExternalId) {
			return this.itemsService.fetchPublicItems(limit);
		} else {
			return this.itemsService.fetchPublicItemsByTitleOrExternalId(
				titleOrExternalId,
				limit,
			);
		}
	}

	@Get('relations')
	@RequireAnyPermissions(Permission.VIEW_ANY_PUBLISHED_ITEMS)
	public async fetchRelationsBySubject(
		@Query('type') type: 'collection' | 'item',
		@Query('subjectIds') subjectIds: string[],
		@Query('relationType') relationType: RelationType,
	): Promise<RelationEntry<Avo.Item.Item | Avo.Collection.Collection>[]> {
		return this.itemsService.fetchRelationsBySubject(
			type,
			subjectIds,
			relationType,
		);
	}

	@Get('ids')
	public async fetchItemUuidByExternalId(
		@Query('externalId') externalId: string,
	): Promise<string | null> {
		return this.itemsService.fetchItemUuidByExternalId(externalId);
	}
}
