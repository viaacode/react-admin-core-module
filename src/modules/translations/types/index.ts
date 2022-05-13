export interface TranslationsConfig {
	service?: {
		getAll: () => Promise<Record<string, string>>;
		updateAll: (updatedTranslations: Record<string, string>) => Promise<Record<string, string>>;
	};
}

export type TranslationData = [string, string];

export interface Translation {
	name: string;
	value: any;
}
