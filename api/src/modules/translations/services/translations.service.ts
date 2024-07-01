import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { groupBy, isEmpty, sortBy } from 'lodash';

import { DataService } from '../../data';
import {
	GetAllLanguagesDocument,
	GetAllLanguagesQuery,
	GetTranslationByComponentLocationKeyDocument,
	GetTranslationByComponentLocationKeyQuery,
	GetTranslationByComponentLocationKeyQueryVariables,
	GetTranslationsByComponentsAndLanguagesDocument,
	GetTranslationsByComponentsAndLanguagesQuery,
	GetTranslationsByComponentsAndLanguagesQueryVariables,
	GetTranslationsByComponentsDocument,
	GetTranslationsByComponentsQuery,
	GetTranslationsByComponentsQueryVariables,
	InsertTranslationDocument,
	InsertTranslationMutation,
	InsertTranslationMutationVariables,
	UpdateTranslationDocument,
	UpdateTranslationMutation,
	UpdateTranslationMutationVariables,
} from '../../shared/generated/graphql-db-types-hetarchief';
import { CustomError } from '../../shared/helpers/custom-error';
import { isAvo } from '../../shared/helpers/is-avo';
import {
	getTranslationFallback,
	resolveTranslationVariables,
} from '../../shared/helpers/translation-fallback';
import {
	App,
	Component,
	Key,
	KeyValueTranslations,
	LanguageInfo,
	Locale,
	Location,
	MultiLanguageTranslationEntry,
	TRANSLATION_SEPARATOR,
	TranslationEntry,
	ValueType,
} from '../translations.types';

@Injectable()
export class TranslationsService implements OnApplicationBootstrap {
	private backendTranslations: Record<Locale, KeyValueTranslations>;

	constructor(
		private dataService: DataService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	public async getLanguages(): Promise<LanguageInfo[]> {
		const response =
			await this.dataService.execute<GetAllLanguagesQuery>(GetAllLanguagesDocument);
		return response.lookup_languages.map(
			(language): LanguageInfo => ({
				languageCode: language.value,
				languageLabel: language.comment,
			})
		);
	}

	public getFullKey(
		translationEntry: TranslationEntry
	): `${Component}${typeof TRANSLATION_SEPARATOR}${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
		return `${translationEntry.component}${TRANSLATION_SEPARATOR}${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
	}

	public async getTranslations(): Promise<MultiLanguageTranslationEntry[]> {
		const translationEntries: TranslationEntry[] = await this.getTranslationsByComponent([
			Component.ADMIN_CORE,
			Component.FRONTEND,
			Component.BACKEND,
		]);
		const groupedByKey: [string, TranslationEntry[]][] = Object.entries(
			groupBy(translationEntries, this.getFullKey)
		);
		const multiLanguageTranslationEntries: MultiLanguageTranslationEntry[] = groupedByKey.map(
			(translationEntryPair): MultiLanguageTranslationEntry => {
				return {
					component: translationEntryPair[1][0].component,
					location: translationEntryPair[1][0].location,
					key: translationEntryPair[1][0].key,
					value_type: translationEntryPair[1][0].value_type,
					values: Object.fromEntries(
						translationEntryPair[1].map((t) => [t.language, t.value])
					) as Record<Locale, string>,
				};
			}
		);
		return sortBy(
			multiLanguageTranslationEntries,
			this.getFullKey
		) as MultiLanguageTranslationEntry[];
	}

	public async upsertTranslation(
		component: Component,
		location: Location,
		key: Key,
		languageCode: Locale,
		value: string
	): Promise<void> {
		try {
			const existingEntries = await this.getTranslationsByComponentLocationKey(
				component,
				location,
				key
			);
			if (existingEntries.find((entry) => entry.language === languageCode)) {
				// Update entry
				await this.updateTranslation(component, location, key, languageCode, value);
			} else {
				// Insert entry (eg: for missing en entry where nl entry already exists
				await this.insertTranslation(
					component,
					location,
					key,
					languageCode,
					value,
					// Use the same value_type as the dutch translation
					existingEntries.find((entry) => entry.language === Locale.Nl)?.value_type ||
						ValueType.TEXT
				);
			}

			await this.cacheManager.reset();
		} catch (err: any) {
			throw CustomError('Failed to insert or update the translation', err, {
				component,
				location,
				key,
				languageCode,
				value,
			});
		}
	}

	public async insertTranslation(
		component: Component,
		location: Location,
		key: Key,
		languageCode: Locale,
		value: string,
		value_type: ValueType
	): Promise<void> {
		try {
			// Insert entry (eg: for missing EN entry where NL entry already exists
			await this.dataService.execute<
				InsertTranslationMutation,
				InsertTranslationMutationVariables
			>(InsertTranslationDocument, {
				component,
				location,
				key,
				languageCode,
				value,
				value_type,
			});

			await this.cacheManager.reset();
		} catch (err: any) {
			throw CustomError('Failed to insert the translation', err, {
				component,
				location,
				key,
				languageCode,
				value,
			});
		}
	}

	public async updateTranslation(
		component: Component,
		location: Location,
		key: Key,
		languageCode: Locale,
		value: string
	): Promise<void> {
		try {
			await this.dataService.execute<
				UpdateTranslationMutation,
				UpdateTranslationMutationVariables
			>(UpdateTranslationDocument, {
				component,
				location,
				key,
				languageCode,
				value,
			});

			await this.cacheManager.reset();
		} catch (err: any) {
			throw CustomError('Failed to update the translation', err, {
				component,
				location,
				key,
				languageCode,
				value,
			});
		}
	}

	public async onApplicationBootstrap() {
		await this.refreshBackendTranslations();
	}

	private convertTranslationEntriesToKeyValue(
		entries: TranslationEntry[]
	): Record<Locale, Record<string, string>> {
		const groupedByLanguage = groupBy(entries, (entry) => entry.language as Locale) as Record<
			Locale,
			TranslationEntry[]
		>;

		const languageCodes = Object.keys(groupedByLanguage) as Locale[];
		return Object.fromEntries(
			languageCodes.map((language) => {
				const translationPairs = groupedByLanguage[language].map(
					(entry): [string, string] => {
						return [entry.location + TRANSLATION_SEPARATOR + entry.key, entry.value];
					}
				);
				return [language, Object.fromEntries(translationPairs)];
			})
		) as Record<Locale, Record<string, string>>;
	}

	public async getTranslationsByComponent(
		components: Component[],
		languageCodes?: Locale[]
	): Promise<TranslationEntry[]> {
		let response:
			| GetTranslationsByComponentsQuery
			| GetTranslationsByComponentsAndLanguagesQuery;
		if (!languageCodes) {
			response = await this.dataService.execute<
				GetTranslationsByComponentsQuery,
				GetTranslationsByComponentsQueryVariables
			>(GetTranslationsByComponentsDocument, { components });
		} else {
			response = await this.dataService.execute<
				GetTranslationsByComponentsAndLanguagesQuery,
				GetTranslationsByComponentsAndLanguagesQueryVariables
			>(GetTranslationsByComponentsAndLanguagesDocument, { components, languageCodes });
		}

		return response.app_translations.map(this.adapt);
	}

	public async getTranslationsByComponentLocationKey(
		component: Component,
		location: Location,
		key: Key
	): Promise<TranslationEntry[]> {
		const response = await this.dataService.execute<
			GetTranslationByComponentLocationKeyQuery,
			GetTranslationByComponentLocationKeyQueryVariables
		>(GetTranslationByComponentLocationKeyDocument, { component, location, key });

		return response.app_translations.map(this.adapt);
	}

	public async getFrontendTranslations(languageCode: Locale): Promise<KeyValueTranslations> {
		const translations = await this.cacheManager.wrap(
			'FRONTEND_TRANSLATIONS_' + languageCode,
			async () => {
				const translations = await this.getTranslationsByComponent(
					[Component.FRONTEND, Component.ADMIN_CORE],
					[languageCode]
				);
				return this.convertTranslationEntriesToKeyValue(translations);
			}, // cache for 30 minutes (milliseconds)
			1_800_000
		);
		if (!translations || isEmpty(translations)) {
			throw new NotFoundException('No translations have been set in the database');
		}

		return translations[languageCode];
	}

	/**
	 * Refresh the local cache of backend translations
	 */
	@Cron('*/30 * * * *')
	public async refreshBackendTranslations(): Promise<void> {
		const languages = await this.getLanguages();
		const translationEntries = await this.getTranslationsByComponent(
			[Component.BACKEND],
			languages.map((language) => language.languageCode) as Locale[]
		);

		if (!translationEntries?.length) {
			throw new NotFoundException('No backend translations have been set in the database');
		}

		this.backendTranslations = this.convertTranslationEntriesToKeyValue(translationEntries);
	}

	public tText(
		key: string,
		variables: Record<string, string | number> | null = null,
		locale: Locale = Locale.Nl
	): string {
		const translation = this.backendTranslations[locale][key];
		if (translation) {
			return resolveTranslationVariables(translation, variables);
		}
		return getTranslationFallback(key, variables);
	}

	private adapt(
		translationEntry: GetTranslationsByComponentsQuery['app_translations'][0]
	): TranslationEntry {
		return {
			app: isAvo() ? App.AVO : App.HET_ARCHIEF,
			component: translationEntry.component as Component,
			location: translationEntry.location,
			key: translationEntry.key,
			language: translationEntry.language,
			value: translationEntry.value,
			value_type: translationEntry.value_type as ValueType,
		};
	}
}
