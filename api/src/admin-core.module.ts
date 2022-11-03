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

@Module({
	imports: [
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
	],
})
export class AdminCoreModule {}
