import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SessionUser } from '../shared/decorators/user.decorator';
import { SessionUserEntity } from '../users/classes/session-user';

import { TableColumnPreferencesService } from './services/table-column-preferences.service';

@ApiTags('TableColumnPreferences')
@Controller(`${process.env.ADMIN_CORE_ROUTES_PREFIX}/table-column-preferences`)
export class TableColumnPreferencesController {
	constructor(protected tableColumnPreferencesService: TableColumnPreferencesService) {}

	@Get(':columnKey')
	public async fetchTableColumnPreference(
		@SessionUser() user: SessionUserEntity,
		@Param('columnKey') columnKey: string
	): Promise<string[]> {
		return this.tableColumnPreferencesService.fetchTableColumnPreference(
			user.getProfileId(),
			columnKey
		);
	}

	@Post(':columnKey')
	public async saveTableColumnPreference(
		@SessionUser() user: SessionUserEntity,
		@Param('columnKey') columnKey: string,
		@Body() columns: string[]
	): Promise<string[]> {
		return this.tableColumnPreferencesService.saveTableColumnPreference(
			user.getProfileId(),
			columnKey,
			JSON.stringify(columns)
		);
	}
}
