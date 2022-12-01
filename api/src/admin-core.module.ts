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
	PlayerTicketModule,
	SiteVariablesModule,
	StatusModule,
} from './modules';
import { UsersModule } from './modules/users/users.module';

@Module({
	imports: [
		AdminNavigationsModule,
		AdminOrganisationsModule,
		AdminPermissionsModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
		UsersModule,
		ContentPagesModule,
		ContentPageLabelsModule,
		DataModule,
		PlayerTicketModule,
		SiteVariablesModule,
		StatusModule,
	],
})
export class AdminCoreModule {}
