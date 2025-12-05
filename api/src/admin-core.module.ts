import { Module } from '@nestjs/common'

import {
	AdminNavigationsModule,
	AdminOrganisationsModule,
	AdminPermissionsModule,
	AdminTranslationsModule,
	AdminUserGroupsModule,
	AssetsModule,
	AssignmentsModule,
	CollectionsModule,
	ContentPageLabelsModule,
	ContentPagesModule,
	DataModule,
	ItemsModule,
	LookupModule,
	MaintenanceAlertsModule,
	PlayerTicketModule,
	SiteVariablesModule,
	StatusModule,
	TableColumnPreferencesModule,
	UsersModule,
	VideoStillsModule,
} from './modules';
import { isAvo } from './modules/shared/helpers/is-avo'
import { isHetArchief } from './modules/shared/helpers/is-hetarchief'

@Module({
	imports: [
		AdminNavigationsModule,
		AdminOrganisationsModule,
		AdminPermissionsModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
		AssetsModule,
		ContentPageLabelsModule,
		ContentPagesModule,
		DataModule,
		LookupModule,
		PlayerTicketModule,
		SiteVariablesModule,
		StatusModule,
		UsersModule,
		VideoStillsModule,
		...(isAvo() ? [AssignmentsModule] : []),
		...(isAvo() ? [CollectionsModule] : []),
		...(isAvo() ? [ItemsModule] : []),
		...(isAvo() ? [TableColumnPreferencesModule] : []),
		...(isHetArchief() ? [MaintenanceAlertsModule] : []),
	],
})
export class AdminCoreModule {}
