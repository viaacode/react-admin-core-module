import { Module } from '@nestjs/common';

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
	UsersModule,
} from './modules';
import { isAvo } from './modules/shared/helpers/is-avo';
import { isHetArchief } from './modules/shared/helpers/is-hetarchief';

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
		...(isAvo() ? [AssignmentsModule] : []),
		...(isAvo() ? [CollectionsModule] : []),
		...(isAvo() ? [ItemsModule] : []),
		...(isHetArchief() ? [MaintenanceAlertsModule] : []),
	],
})
export class AdminCoreModule {}
