import { kebabCase } from 'lodash-es';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { executeDatabaseQuery } from './execute-database-query.mts';
import { App, type TranslationEntry } from './translation.types.mts';

async function getOnlineTranslations(app: App): Promise<TranslationEntry[]> {
	const response = await executeDatabaseQuery(
		app,
		`
	query getAllTranslations {
	  app_translations {
	    component
	    key
	    language
	    location
	    value
	    value_type
	  }
	}
		`,
		{},
		'QAS' // Get translations from QAS
	);
	return response.data.app_translations.map((t: TranslationEntry) => ({ ...t, app }));
}

async function writeTranslationsToFile(
	filePath: string,
	translations: TranslationEntry[]
): Promise<void> {
	// Output all translations as sql file
	let sql: string = translations
		.map((translationEntry) => {
			const component = `'${translationEntry.component}'`;
			const location = `'${translationEntry.location}'`;
			const key = `'${translationEntry.key}'`;
			const value = `'${translationEntry.value.replace(/'/g, "''")}'`;
			const value_type = `'${translationEntry.value_type}'`;
			const language = `'${translationEntry.language}'`;
			return `INSERT INTO app.translations ("component", "location", "key", "value", "value_type", "language") VALUES (${component}, ${location}, ${key}, ${value}, ${value_type}, ${language}) ON CONFLICT (component, location, key, language) DO UPDATE SET value = ${value}, value_type = ${value_type};`;
		})
		.sort()
		.join('\n');
	sql = `TRUNCATE app.translations;\n${sql}`;
	await fs.writeFile(filePath, sql);
	console.info(`Finished writing ${translations.length} translations`);
}

async function backupTranslations(): Promise<void> {
	const app = process.argv[2] as App;
	if (app !== App.AVO && app !== App.HET_ARCHIEF) {
		throw new Error(
			'Backup translation script started with wrong "APP" parameter. Only valid values are: ["AVO", "HET_ARCHIEF"]'
		);
	}

	const translations = await getOnlineTranslations(app);

	const sqlFilePath = path.resolve(
		`./data/${new Date().toISOString().split('T')[0]}-translations-${kebabCase(app)}-QAS-v3.sql`
	);
	await writeTranslationsToFile(sqlFilePath, translations);
}

backupTranslations().catch((err) => {
	console.error('Backup translations failed: ', err);
});
