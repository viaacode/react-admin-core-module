import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { PermissionName } from '@viaa/avo2-types';

import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { addPrefix } from '../../shared/helpers/add-route-prefix';
import { UpdateTranslationDto } from '../dto/translations.dto';
import { TranslationsService } from '../services/translations.service';
import {
	type KeyValueTranslations,
	type LanguageInfo,
	Locale,
	MultiLanguageTranslationEntry,
} from '../translations.types';

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
		enum: [
			// nl, en
			...Object.values(Locale),
		],
	})
	public async getTranslationsJson(
		@Param('languageCode') languageCode: Locale
	): Promise<KeyValueTranslations> {
		return this.translationsService.getFrontendTranslations(languageCode.toLowerCase() as Locale);
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
	 * Update or inserts one translation entry value
	 * @param updatedTranslation
	 */
	@Post()
	@ApiOperation({
		description:
			"Set the value of a single translation entry for the specified component/location/key combination or creates the entry if it doesn't exist",
	})
	@RequireAllPermissions(PermissionName.EDIT_TRANSLATIONS)
	public async updateTranslation(@Body() updatedTranslation: UpdateTranslationDto): Promise<void> {
		await this.translationsService.upsertTranslation(
			updatedTranslation.component,
			updatedTranslation.location,
			updatedTranslation.key,
			updatedTranslation.languageCode,
			updatedTranslation.value
		);
	}
}
