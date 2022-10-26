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
	DataModule,
	PlayerTicketModule,
	SiteVariablesModule,
	StatusModule,
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
