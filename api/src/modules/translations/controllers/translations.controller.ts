import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { UpdateTranslationDto } from '../dto/translations.dto';
import { TranslationsService } from '../services/translations.service';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import {
	type KeyValueTranslations,
	LanguageCode,
	type LanguageInfo,
	MultiLanguageTranslationEntry,
	TranslationEntry,
} from '../translations.types';
import { addPrefix } from '../../shared/helpers/add-route-prefix';

@ApiTags('Translations')
@Controller(addPrefix(process, 'translations'))
export class TranslationsController {
	constructor(private translationsService: TranslationsService) {}

	/**
	 * Get the frontend (admin-core and frontend) translations for a specific language
	 * This endpoint is used by the client to translate labels in the UI
	 * @param languageCode
	 */
	@Get(':languageCode.json')
	@ApiParam({
		name: 'languageCode',
		enum: LanguageCode,
	})
	public async getTranslationsJson(
		@Param('languageCode') languageCode: LanguageCode
	): Promise<KeyValueTranslations> {
		return this.translationsService.getFrontendTranslations(languageCode);
	}

	/**
	 * Get all language codes and their label
	 */
	@Get('languages')
	public async getLanguages(): Promise<LanguageInfo[]> {
		return this.translationsService.getLanguages();
	}

	/**
	 * Get all translations for all languages
	 * Mostly used to get all translations in the admin-dashboard
	 */
	@Get()
	public async getTranslations(): Promise<MultiLanguageTranslationEntry[]> {
		return this.translationsService.getTranslations();
	}

	/**
	 * Update one translation entry value
	 * @param newTranslation
	 */
	@Post()
	@ApiOperation({
		description:
			'Set the value of a single translation entry for the specified component/location/key combination',
	})
	@RequireAllPermissions(PermissionName.EDIT_TRANSLATIONS)
	public async updateTranslation(@Body() newTranslation: UpdateTranslationDto): Promise<void> {
		await this.translationsService.updateTranslation(
			newTranslation.component,
			newTranslation.location,
			newTranslation.key,
			newTranslation.languageCode,
			newTranslation.value
		);
	}
}
