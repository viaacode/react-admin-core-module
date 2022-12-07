import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Avo } from '@viaa/avo2-types';
import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator';

import { Permission } from '../../users';
import { ContentTypeNumber } from '../collections.types';
import { CollectionsService } from '../services/collections.service';

@ApiTags('Collections')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/collections')
export class CollectionsController {
	constructor(private collectionsService: CollectionsService) {}

	@Get('public')
	@RequireAnyPermissions(
		Permission.VIEW_ANY_PUBLISHED_COLLECTIONS,
		Permission.EDIT_ANY_CONTENT_PAGES,
		Permission.EDIT_OWN_CONTENT_PAGES,
	)
	public async fetchCollectionsOrBundles(
		@Query('limit') limit: number,
		@Query('typeId') typeId: ContentTypeNumber,
	): Promise<Avo.Collection.Collection[]> {
		return this.collectionsService.fetchCollectionsOrBundles(limit, typeId);
	}

	@Get('')
	public async fetchCollectionsOrBundlesById(
		@Query('isCollection') isCollection: boolean,
		@Query('titleOrId') titleOrId: string,
		@Query('limit') limit: number,
	): Promise<Avo.Collection.Collection[]> {
		if (isCollection) {
			return this.collectionsService.fetchCollectionsByTitleOrId(
				titleOrId,
				limit,
			);
		} else {
			return this.collectionsService.fetchBundlesByTitleOrId(titleOrId, limit);
		}
	}
}
