import {
	CACHE_MANAGER,
	Inject,
	Injectable,
	NotFoundException,
	OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
	getTranslationFallback,
	resolveTranslationVariables,
} from '../../shared/helpers/translation-fallback';
import { Cache } from 'cache-manager';

import { TranslationKey } from '../types';

import { SiteVariablesService } from '../../site-variables';
import { Translations } from '../types';
import { UpdateResponse } from '../../shared/types/types';

@Injectable()
export class TranslationsService implements OnApplicationBootstrap {
	private backendTranslations: Translations;

	constructor(
		private siteVariablesService: SiteVariablesService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	public async getTranslations(): Promise<
		Record<string, Record<string, string>>
	> {
		const [translationsFrontend, translationsAdminCore, translationsBackend] =
			await Promise.all([
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.TRANSLATIONS_FRONTEND,
				),
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.TRANSLATIONS_ADMIN_CORE,
				),
				this.siteVariablesService.getSiteVariable<Translations>(
					TranslationKey.TRANSLATIONS_BACKEND,
				),
			]);
		return {
			TRANSLATIONS_FRONTEND: translationsFrontend,
			TRANSLATIONS_ADMIN_CORE: translationsAdminCore,
			TRANSLATIONS_BACKEND: translationsBackend,
		};
	}

	public async updateTranslations(
		key: TranslationKey,
		value: Record<string, string>,
	): Promise<UpdateResponse> {
		return this.siteVariablesService.updateSiteVariable(key, value);
	}

	public async onApplicationBootstrap() {
		await this.refreshBackendTranslations();
	}

	public async getFrontendTranslations(): Promise<Translations> {
		const translations = await this.cacheManager.wrap(
			TranslationKey.TRANSLATIONS_FRONTEND,
			async () => {
				const [translationsFrontend, translationsAdminCore] = await Promise.all(
					[
						this.siteVariablesService.getSiteVariable<Translations>(
							TranslationKey.TRANSLATIONS_FRONTEND,
						),
						this.siteVariablesService.getSiteVariable<Translations>(
							TranslationKey.TRANSLATIONS_ADMIN_CORE,
						),
					],
				);
				return {
					...translationsAdminCore,
					...translationsFrontend,
				};
			}, // cache for 1h
			{ ttl: 3600 },
		);
		if (!translations) {
			throw new NotFoundException(
				'No translations have been set in the database',
			);
		}

		return translations;
	}

	/**
	 * Refresh the local cache of backend translations
	 */
	@Cron('0 * * * *')
	public async refreshBackendTranslations(): Promise<void> {
		const translations =
			await this.siteVariablesService.getSiteVariable<Translations>(
				TranslationKey.TRANSLATIONS_BACKEND,
			);

		if (!translations) {
			throw new NotFoundException(
				'No backend translations have been set in the database',
			);
		}

		this.backendTranslations = translations;
	}

	public t(
		key: string,
		variables: Record<string, string | number> = {},
	): string {
		const translation = this.backendTranslations[key];
		if (translation) {
			return resolveTranslationVariables(translation, variables);
		}
		return getTranslationFallback(key, variables);
	}
}
