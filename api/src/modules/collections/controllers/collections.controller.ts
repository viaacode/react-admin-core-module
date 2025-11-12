import { Controller, Get, ParseBoolPipe, ParseIntPipe, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { Avo } from '@viaa/avo2-types'
import { PermissionName } from '@viaa/avo2-types'

import { RequireAnyPermissions } from '../../shared/decorators/require-any-permissions.decorator'
import { ContentTypeNumber } from '../collections.types'
import { CollectionsService } from '../services/collections.service'

@ApiTags('Collections')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/collections')
export class CollectionsController {
	constructor(private collectionsService: CollectionsService) {}

	@Get('public')
	@RequireAnyPermissions(
		PermissionName.VIEW_ANY_PUBLISHED_COLLECTIONS,
		PermissionName.EDIT_ANY_CONTENT_PAGES,
		PermissionName.EDIT_OWN_CONTENT_PAGES
	)
	public async fetchCollectionsOrBundles(
		@Query('limit', ParseIntPipe) limit: number,
		@Query('typeId', ParseIntPipe) typeId: ContentTypeNumber
	): Promise<Avo.Collection.Collection[]> {
		return this.collectionsService.fetchCollectionsOrBundles(limit, typeId)
	}

	@Get('')
	public async fetchCollectionsOrBundlesById(
		@Query('isCollection', ParseBoolPipe) isCollection: boolean,
		@Query('titleOrId') titleOrId: string,
		@Query('limit', ParseIntPipe) limit: number
	): Promise<Avo.Collection.Collection[]> {
		if (isCollection) {
			return this.collectionsService.fetchCollectionsByTitleOrId(titleOrId, limit)
		} else {
			return this.collectionsService.fetchBundlesByTitleOrId(titleOrId, limit)
		}
	}
}
