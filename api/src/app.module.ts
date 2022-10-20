import { Module } from '@nestjs/common';
import { ContentPagesModule } from './modules/admin-core/content-pages/content-pages.module';
import { AdminNavigationsModule } from './modules/admin-core/navigations/admin-navigations.module';
import { AdminOrganisationsModule } from './modules/admin-core/organisations/admin-organisations.module';
import { AdminPermissionsModule } from './modules/admin-core/permissions/permissions.module';
import { PlayerTicketModule } from './modules/admin-core/player-ticket/player-ticket.module';
import { SiteVariablesModule } from './modules/admin-core/site-variables/site-variables.module';
import { AdminTranslationsModule } from './modules/admin-core/translations/translations.module';
import { AdminUserGroupsModule } from './modules/admin-core/user-groups/user-groups.module';
import { StatusModule } from './modules/status';

@Module({
	imports: [
		StatusModule,
		ContentPagesModule,
		AdminNavigationsModule,
		AdminOrganisationsModule,
		AdminPermissionsModule,
		PlayerTicketModule,
		SiteVariablesModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
	],
})
export class AppModule {}
