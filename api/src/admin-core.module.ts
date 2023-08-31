import { Module } from '@nestjs/common';
import {
	AdminNavigationsModule,
	AdminOrganisationsModule,
	AdminPermissionsModule,
	AdminTranslationsModule,
	AdminUserGroupsModule,
	AssetsModule,
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

@Module({
	imports: [
		AdminNavigationsModule,
		AdminOrganisationsModule,
		AdminPermissionsModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
		AssetsModule,
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
	],
})
export class AdminCoreModule {}
