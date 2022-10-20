import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContentPagesModule } from './modules/admin-core/content-pages';
import { AdminNavigationsModule } from './modules/admin-core/navigations';
import { AdminOrganisationsModule } from './modules/admin-core/organisations';
import { AdminPermissionsModule } from './modules/admin-core/permissions';
import { PlayerTicketModule } from './modules/admin-core/player-ticket';
import { SiteVariablesModule } from './modules/admin-core/site-variables';
import { AdminTranslationsModule } from './modules/admin-core/translations';
import { AdminUserGroupsModule } from './modules/admin-core/user-groups';

@Module({
	imports: [
		ContentPagesModule,
		AdminNavigationsModule,
		AdminOrganisationsModule,
		AdminPermissionsModule,
		PlayerTicketModule,
		SiteVariablesModule,
		AdminTranslationsModule,
		AdminUserGroupsModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
