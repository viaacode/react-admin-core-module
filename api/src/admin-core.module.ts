import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './config';
import {
	AdminNavigationsModule,
	AdminOrganisationsModule,
	AdminPermissionsModule,
	AdminTranslationsModule,
	AdminUserGroupsModule,
	ContentPagesModule,
	PlayerTicketModule,
	SiteVariablesModule,
} from './modules';

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: true,
			validationSchema: configValidationSchema,
			validationOptions: {
				allowUnknown: true,
				abortEarly: true,
			},
		}),
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
export class AdminCoreModule {}
