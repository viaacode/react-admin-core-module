import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdateTranslationsDto } from '../dto/translations.dto';
import { TranslationsService } from '../services/translations.service';

import { Permission } from '../../users/types';
import { RequireAllPermissions } from '../../shared/decorators/require-permissions.decorator';
import { UpdateResponse } from '../../shared/types/types';
import { Translations } from '../types';

@ApiTags('Translations')
@Controller(process.env.ADMIN_CORE_ROUTES_PREFIX + '/translations')
export class TranslationsController {
	constructor(private translationsService: TranslationsService) {}

	@Get('nl.json')
	public async getTranslationsJson(): Promise<Translations> {
		return this.translationsService.getFrontendTranslations();
	}

	@Get()
	public async getTranslations(): Promise<
		Record<string, Record<string, string>>
	> {
		return this.translationsService.getTranslations();
	}

	@Post()
	@ApiOperation({
		description:
			'Set translations for the specified key. Careful: this overwrites all existing values.',
	})
	@RequireAllPermissions(Permission.EDIT_TRANSLATIONS)
	public async updateTranslations(
		@Body() newTranslations: UpdateTranslationsDto,
	): Promise<UpdateResponse> {
		return this.translationsService.updateTranslations(
			newTranslations.key,
			newTranslations.data,
		);
	}
}
