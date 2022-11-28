import { Module } from '@nestjs/common';
import {
	AdminNavigationsModule,
	AdminOrganisationsModule,
	AdminPermissionsModule,
	AdminTranslationsModule,
	AdminUserGroupsModule,
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
		DataModule,
		PlayerTicketModule,
		SiteVariablesModule,
		StatusModule,
	],
})
export class AdminCoreModule {}
