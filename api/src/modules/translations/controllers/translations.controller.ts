import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';
import { snakeCase } from 'lodash';

import { UpdateTranslationsDto } from '../dto/translations.dto';
import { TranslationsService } from '../services/translations.service';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { UpdateResponse } from '../../shared/types/types';
import { TranslationKey, Translations } from '../types';
import { addPrefix } from '../../shared/helpers/add-route-prefix';

@ApiTags('Translations')
@Controller(addPrefix(process, 'translations'))
export class TranslationsController {
	constructor(private translationsService: TranslationsService) {}

	@Get('nl.json')
	public async getTranslationsJson(): Promise<Translations> {
		return this.translationsService.getFrontendTranslations();
	}

	@Get('frontend.json')
	public async getFrontendTranslationsJson(): Promise<Translations> {
		const translations = await this.translationsService.getTranslations();
		return translations[snakeCase(TranslationKey.TRANSLATIONS_FRONTEND).toUpperCase()];
	}

	@Get('backend.json')
	public async getBackendTranslationsJson(): Promise<Translations> {
		const translations = await this.translationsService.getTranslations();
		return translations[snakeCase(TranslationKey.TRANSLATIONS_BACKEND).toUpperCase()];
	}

	@Get('admin-core.json')
	public async getAdminCoreTranslationsJson(): Promise<Translations> {
		const translations = await this.translationsService.getTranslations();
		return translations[snakeCase(TranslationKey.TRANSLATIONS_ADMIN_CORE).toUpperCase()];
	}

	@Get()
	public async getTranslations(): Promise<Record<string, Record<string, string>>> {
		return this.translationsService.getTranslations();
	}

	@Post()
	@ApiOperation({
		description:
			'Set translations for the specified key. Careful: this overwrites all existing values.',
	})
	@RequireAllPermissions(PermissionName.EDIT_TRANSLATIONS)
	public async updateTranslations(
		@Body() newTranslations: UpdateTranslationsDto
	): Promise<UpdateResponse> {
		return this.translationsService.updateTranslations(
			newTranslations.key,
			newTranslations.data
		);
	}
}
