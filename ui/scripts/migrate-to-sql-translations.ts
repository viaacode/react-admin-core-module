// noinspection ES6PreferShortImport

/**
 * This script will read all the nl.json files in all the repos and convert them to one big sql file for nl and en languages
 */

import * as fs from 'fs/promises';
import { kebabCase, trim } from 'lodash';
import * as path from 'path';
import {
	App,
	Component,
	LanguageCode,
	TRANSLATION_SEPARATOR,
	TranslationEntry,
} from '../src/react-admin/modules/translations/translations.core.types';
import { mapLimit } from 'blend-promise-utils';

/**
 * Translates dutch text using ollama llm
 * https://gist.github.com/bertyhell/4b90cc283800150550c67abf80832aa3
 * @param dutchText
 */
async function machineTranslate(dutchText: string): Promise<string> {
	const prompt =
		'translate this text from dutch to english. Answer only with the translated text that is between the quotes, nothing else: ```' +
		dutchText +
		'```';
	const body = JSON.stringify({
		model: 'llama3',
		prompt: prompt,
		stream: false,
	});

	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const response = await fetch('http://localhost:11434/api/generate', {
		body: body,
		method: 'POST',
		headers,
	});
	const responseJson = await response.json();
	return trim(responseJson.response, '\'"`');
}

async function migrateTranslations(
	rootFolderPath: string,
	app: App,
	component: Component,
	outputJsonFile: string
): Promise<TranslationEntry[]> {
	try {
		const nlJsonTranslations: Record<string, string> = JSON.parse(
			(await fs.readFile(path.resolve(rootFolderPath, outputJsonFile))).toString()
		);
		const nlTranslationEntries = Object.entries(nlJsonTranslations).map(
			(entry): TranslationEntry => {
				return {
					app,
					component,
					location: entry[0].split(TRANSLATION_SEPARATOR)[0],
					key: entry[0].split(TRANSLATION_SEPARATOR)[1],
					language: LanguageCode.Nl,
					value: entry[1],
					value_type: null,
				};
			}
		);

		let englishTranslationEntries: TranslationEntry[] = [];
		if (app === App.HET_ARCHIEF) {
			console.log('Translating ' + nlTranslationEntries.length + ' translations');
			// Also include English entries
			englishTranslationEntries = await mapLimit(
				nlTranslationEntries,
				10,
				async (nlTranslationEntry, i): Promise<TranslationEntry> => {
					console.log(
						'Translating ' + i + ' / ' + nlTranslationEntries.length + ' translations'
					);
					return {
						...nlTranslationEntry,
						language: LanguageCode.En,
						value: await machineTranslate(nlTranslationEntry.value),
					};
				}
			);
		}
		console.log('Translating ' + nlTranslationEntries.length + ' translations -- done');

		return [...nlTranslationEntries, ...englishTranslationEntries];
	} catch (err) {
		throw new Error(
			JSON.stringify({
				message: 'Failed to update translations',
				innerException: JSON.stringify(err, Object.getOwnPropertyNames(err)),
				additionalInfo: {
					rootFolderPath,
					app,
					component,
					outputJsonFile,
				},
			})
		);
	}
}

async function migrateAllTranslations() {
	const app = process.argv[2] as App;
	if (app !== App.AVO && app !== App.HET_ARCHIEF) {
		throw new Error(
			'Translation script started with wrong "APP" parameter. Only valid values are: ["AVO", "HET_ARCHIEF"]'
		);
	}

	let allTranslations: TranslationEntry[];

	if (app === App.AVO) {
		// AVO admin-core
		console.info('Migrate AVO admin-core translations...');
		const avoAdminCoreTranslations = await migrateTranslations(
			path.resolve(__dirname, '../src/react-admin'),
			App.AVO,
			Component.ADMIN_CORE,
			'../shared/translations/avo/nl.json'
		);

		// AVO client
		console.info('Migrate AVO client translations...');
		const avoClientTranslations = await migrateTranslations(
			path.resolve(__dirname, '../../../avo2-client/src'),
			App.AVO,
			Component.FRONTEND,
			'shared/translations/nl.json'
		);

		// AVO proxy
		console.info('Migrate AVO admin-core translations...');
		const avoProxyTranslations = await migrateTranslations(
			path.resolve(__dirname, '../../../avo2-proxy/server/src'),
			App.AVO,
			Component.BACKEND,
			'shared/translations/nl.json'
		);

		allTranslations = [
			...avoAdminCoreTranslations,
			...avoClientTranslations,
			...avoProxyTranslations,
		];
	} else {
		// HetArchief admin-core
		console.info('Migrate HET_ARCHIEF admin-core translations...');
		const hetArchiefAdminCoreTranslations = await migrateTranslations(
			path.resolve(__dirname, '../src/react-admin'),
			App.HET_ARCHIEF,
			Component.ADMIN_CORE,
			'../shared/translations/hetArchief/nl.json'
		);

		// HetArchief client
		console.info('Migrate HET_ARCHIEF client translations...');
		const hetArchiefClientTranslations = await migrateTranslations(
			path.resolve(__dirname, '../../../hetarchief-client/src'),
			App.HET_ARCHIEF,
			Component.FRONTEND,
			'../public/locales/nl/common.json'
		);

		// HetArchief proxy
		console.info('Migrate HET_ARCHIEF proxy translations...');
		const hetArchiefProxyTranslations = await migrateTranslations(
			path.resolve(__dirname, '../../../hetarchief-proxy/src'),
			App.HET_ARCHIEF,
			Component.BACKEND,
			'shared/i18n/locales/nl.json'
		);

		allTranslations = [
			...hetArchiefAdminCoreTranslations,
			...hetArchiefClientTranslations,
			...hetArchiefProxyTranslations,
		];
	}

	// Output all translations as sql file
	const sqlFilePath = path.resolve('./all-translations-' + kebabCase(app) + '.sql');
	await fs.writeFile(sqlFilePath.replace('.sql', '.json'), JSON.stringify(allTranslations));
	console.info('Writing SQL file: ' + sqlFilePath);
	let sql: string = allTranslations
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
	sql = 'TRUNCATE app.translations;\n' + sql;
	await fs.writeFile(sqlFilePath, sql);
	console.info('Finished writing ' + allTranslations.length + ' translations');
}

migrateAllTranslations().catch((err) => {
	console.error('Migrate translations failed: ', err);
});
