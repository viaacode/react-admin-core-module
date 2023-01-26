import { Module } from '@nestjs/common';
import {
	AdminNavigationsModule,
	AdminOrganisationsModule,
	AdminPermissionsModule,
	AdminTranslationsModule,
	AdminUserGroupsModule,
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

@Module({
	imports: [
		AdminNavigationsModule,
		AdminOrganisationsModule,
		AdminPermissionsModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
		ContentPageLabelsModule,
		ContentPagesModule,
		DataModule,
		LookupModule,
		PlayerTicketModule,
		SiteVariablesModule,
		StatusModule,
		UsersModule,
		ItemsModule,
		MaintenanceAlertsModule
	],
})
export class AdminCoreModule {}
