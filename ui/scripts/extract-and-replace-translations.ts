// noinspection ES6PreferShortImport

/**
 This script runs over all the code and looks for either:
tHtml('Aanvraagformulier')
or
tText('Aanvraagformulier')

and replaces them with:
tHTml('authentication/views/registration-flow/r-4-manual-registration___aanvraagformulier')
or
tText('authentication/views/registration-flow/r-4-manual-registration___aanvraagformulier')


and it also outputs a json file with the translatable strings:
{
	"authentication/views/registration-flow/r-4-manual-registration___aanvraagformulier": "Aanvraagformulier"
}

Every time the `npm run extract-translations` command is run, it will extract new translations that it finds
(without i18nKey or not containing "___")
and add them to the json file without overwriting the existing strings.

We can now input the src/modules/shared/translations/.../nl.json files into their respective database so the translations can be updated by meemoo through the admin dashboard.
 */

import { mapLimit } from 'blend-promise-utils';
import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as glob from 'glob';
import { compact, intersection, kebabCase, lowerCase, upperFirst, without } from 'lodash';
import * as path from 'path';
import { getFullKey } from '../src/react-admin/modules/translations/helpers/get-full-key';
import {
	App,
	Component,
	LanguageCode,
	TRANSLATION_SEPARATOR,
	TranslationEntry,
	ValueType,
} from '../src/react-admin/modules/translations/translations.core.types';

import { executeDatabaseQuery } from './execute-database-query';

type AppsList = (App.AVO | App.HET_ARCHIEF)[];

function getFormattedKey(filePath: string, key: string) {
	try {
		const fileKey = filePath
			.replace(/[\\/]+/g, '/')
			.split('.')[0]
			.split(/[\\/]/g)
			.map((part) => kebabCase(part))
			.join('/')
			.toLowerCase()
			.replace(/(^\/+|\/+$)/g, '')
			.trim();
		const formattedKey = kebabCase(key);

		return `${fileKey}${TRANSLATION_SEPARATOR}${formattedKey}`;
	} catch (err) {
		console.error('Failed to format key', filePath, key);
	}
}

function getFormattedTranslation(translation: string) {
	if (!translation) {
		return translation;
	}
	return translation.trim().replace(/\t\t(\t)+/g, ' ');
}

async function getFilesByGlob(rootFolderPath: string): Promise<string[]> {
	const options = {
		ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
		cwd: rootFolderPath,
	};
	return glob.glob('**/*.@(ts|tsx)', options);
}

function getFallbackTranslation(key: string): string {
	return `${upperFirst(lowerCase(key.split(TRANSLATION_SEPARATOR).pop()))}`;
}

async function extractTranslationsFromCodeFiles(
	rootFolderPath: string,
	codeFiles: string[],
	app: App,
	component: Component,
	oldTranslations: Record<string, string>
): Promise<TranslationEntry[]> {
	const sourceCodeTranslations: TranslationEntry[] = [];
	// Find and extract translations, replace strings with translation keys
	await mapLimit(codeFiles, 20, async (relativeFilePath: string) => {
		try {
			const absoluteFilePath = path.resolve(rootFolderPath, relativeFilePath);
			const content: string = (await fs.readFile(absoluteFilePath)).toString();

			// Replace tHtml() and tText() functions
			const beforeTFunction = '([^a-zA-Z])'; // eg: .
			const tFuncStart = '(tHtml|tText|t)\\('; // eg: tHtml
			const whitespace = '\\s*';
			const quote = '[\'"]'; // eg: "
			const translation = '([^,)]+?)'; // eg: admin/content-block/helpers/generators/klaar___voeg-titel-toe
			const translationVariables = '([\\s]*,[\\s]*([^)]*?|undefined))?'; // eg: , {numberOfPeople: 5} or , undefined
			const appsVariable = '([\\s]*,[\\s]*(\\[[^\\]]*\\]))?'; // eg: , [AVO]
			const tFuncEnd = '[\\s]*\\)'; // eg: )
			const combinedRegex = [
				beforeTFunction,
				tFuncStart,
				whitespace,
				quote,
				translation,
				quote,
				whitespace,
				translationVariables,
				appsVariable,
				whitespace,
				tFuncEnd,
			].join('');
			const regex = new RegExp(combinedRegex, 'gim');
			const newContent = content.replace(
				// Match char before t function to make sure it isn't part of a bigger function name, eg: sent()
				regex,
				(
					match: string,
					prefix: string,
					tFunction: 'tText' | 'tHtml' | 't',
					translation: string,
					translationParamsWithComma: string | undefined,
					translationParams: string | undefined,
					appsParamWithComma: string | undefined,
					appsParam: string | undefined
				) => {
					let formattedKey: string | undefined;
					const apps: AppsList = compact(
						(appsParam || `, [${App.AVO}, ${App.HET_ARCHIEF}]`)
							.replace(/[[\]]/g, '')
							.split(',')
							.map((app) => app.trim())
					) as AppsList;
					const formattedTranslation: string = getFormattedTranslation(translation);
					if (formattedTranslation.includes(TRANSLATION_SEPARATOR)) {
						formattedKey = formattedTranslation;
					} else {
						formattedKey = getFormattedKey(relativeFilePath, formattedTranslation);
					}

					if (!formattedKey) {
						return match; // Do not modify the translations, since we cannot generate a key
					}

					if ((translationParams || '').includes('(')) {
						console.warn(
							'WARNING: Translation params should not contain any function calls, ' +
								'since the regex replacement cannot deal with brackets inside the t() function. ' +
								'Store the translation params in a variable before calling the t() function.',
							{
								match,
								prefix,
								tFunction,
								translation,
								translationParams,
								appsParam,
								absoluteFilePath,
							}
						);
					}
					// If translation contains '___', use original translation, otherwise use translation found by the regexp
					const hasKeyAlready = formattedTranslation.includes(TRANSLATION_SEPARATOR);
					if (apps.includes(app)) {
						if (hasKeyAlready && !oldTranslations[formattedKey]) {
							console.error(
								`Failed to find old translation in ${app}/nl.json for key: `,
								formattedKey
							);
						}
						const location = formattedKey.split(TRANSLATION_SEPARATOR)[0];
						const key = formattedKey.split(TRANSLATION_SEPARATOR)[1];

						sourceCodeTranslations.push({
							app,
							component,
							location,
							key,
							language: LanguageCode.Nl,
							value:
								(hasKeyAlready
									? getFormattedTranslation(
											oldTranslations[formattedKey] ||
												getFallbackTranslation(formattedKey)
									  )
									: formattedTranslation) || '',
							value_type: tFunction === 'tHtml' ? ValueType.HTML : ValueType.TEXT,
						});
					}

					if (hasKeyAlready) {
						return match;
					} else {
						return `${prefix}${tFunction}('${formattedKey}'${
							translationParams ? ', ' + translationParams : ''
						}${appsParam ? ', ' + appsParam : ''})`;
					}
				}
			);

			if (content !== newContent) {
				await fs.writeFile(absoluteFilePath, newContent);
			}
		} catch (err) {
			console.error(`Failed to find translations in file: ${relativeFilePath}`, err);
		}
	});
	return sourceCodeTranslations;
}

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
		`
	);
	return response.data.app_translations.map((t: TranslationEntry) => ({ ...t, app }));
}

function checkTranslationsForKeysAsValue(translationJson: string) {
	// Identify  if any translations contain "___", then something went wrong with the translations
	const faultyTranslations = [];
	const faultyTranslationRegexp = /"(.*___.*)": ".*___/g;
	let matches: RegExpExecArray | null;
	do {
		matches = faultyTranslationRegexp.exec(translationJson);
		if (matches) {
			faultyTranslations.push(matches[1]);
		}
	} while (matches);

	if (faultyTranslations.length) {
		throw new Error(`
			Failed to extract translations, the following translations would be overridden by their key:
				\t${faultyTranslations.join('\n\t')}
		`);
	}
}

function sortObjectKeys(objToSort: Record<string, any>): Record<string, any> {
	return Object.keys(objToSort)
		.sort()
		.reduce((obj: Record<string, string>, key) => {
			obj[key] = objToSort[key];
			return obj;
		}, {});
}

async function combineTranslations(
	nlJsonTranslations: TranslationEntry[],
	nlSourceCodeTranslations: TranslationEntry[],
	allOnlineTranslations: TranslationEntry[],
	outputJsonFile: string
): Promise<TranslationEntry[]> {
	// Compare existing translations to the new translations
	const nlJsonTranslationKeys: string[] = nlJsonTranslations.map(getFullKey);
	const sourceCodeTranslationKeys: string[] = nlSourceCodeTranslations.map(getFullKey);
	const addedTranslationKeys: string[] = without(
		sourceCodeTranslationKeys,
		...nlJsonTranslationKeys
	);
	const removedTranslationKeys: string[] = without(
		nlJsonTranslationKeys,
		...sourceCodeTranslationKeys
	);
	const existingTranslationKeys: string[] = intersection(
		sourceCodeTranslationKeys,
		nlJsonTranslationKeys
	);

	// Console log translations that were found in the json file but not in the code
	if (removedTranslationKeys.length > 0) {
		console.warn('The following translation keys were removed:');
		console.log(`\t${removedTranslationKeys.map((key) => key.trim()).join('\n\t')}`);
	}

	// Combine the translations in the json with the freshly extracted translations from the code
	const combinedTranslationEntries: TranslationEntry[] = [];
	[...existingTranslationKeys, ...addedTranslationKeys].forEach((translationKey: string) => {
		const onlineTranslations = allOnlineTranslations.filter(
			(t) => getFullKey(t) === translationKey
		);
		const nlOnlineTranslation = onlineTranslations.find((t) => t.language === LanguageCode.Nl);
		const nlJsonTranslation = nlJsonTranslations.find(
			(t) => getFullKey(t) === translationKey
		) as TranslationEntry;
		const sourceCodeTranslation = nlSourceCodeTranslations.find(
			(t) => getFullKey(t) === translationKey
		) as TranslationEntry;

		if (!nlOnlineTranslation && !nlJsonTranslation && !sourceCodeTranslation) {
			console.error(
				'Failed to find translation in online, nl.json and in code: ' + translationKey
			);
		}

		if (!nlOnlineTranslation && nlJsonTranslation && !sourceCodeTranslation) {
			console.error(
				'Only found translation in nl.json, not in online translations not in code: ' +
					translationKey
			);
		}

		// Output translations for both NL and EN
		[LanguageCode.Nl, LanguageCode.En].forEach((languageCode) => {
			const onlineTranslation = onlineTranslations.find((t) => t.language === languageCode);
			const entry: TranslationEntry = {
				app:
					sourceCodeTranslation?.app ||
					nlOnlineTranslation?.app ||
					nlJsonTranslation?.app,
				component:
					sourceCodeTranslation?.component ||
					onlineTranslation?.component ||
					nlJsonTranslation?.component,
				location:
					sourceCodeTranslation?.location ||
					onlineTranslation?.location ||
					nlJsonTranslation?.location,
				key: sourceCodeTranslation?.key || onlineTranslation?.key || nlJsonTranslation?.key,
				language: languageCode, // All source code translations are dutch, online translation can exist in EN and NL
				value:
					onlineTranslation?.value ||
					nlJsonTranslation?.value ||
					sourceCodeTranslation?.value, // Online translations always have priority. Code translations are lowest priority
				value_type:
					sourceCodeTranslation?.value_type ||
					onlineTranslation?.value_type ||
					ValueType.TEXT, // translations in json file do not store the value type
			};

			combinedTranslationEntries.push(entry);
		});
	});

	const combinedTranslations = Object.fromEntries(
		combinedTranslationEntries
			.filter((entry) => entry.language === LanguageCode.Nl)
			.map((entry) => [entry.location + TRANSLATION_SEPARATOR + entry.key, entry.value])
	);
	const nlJsonContent = JSON.stringify(sortObjectKeys(combinedTranslations), null, 2);
	checkTranslationsForKeysAsValue(nlJsonContent); // Throws error if any key is found as a value

	await fs.writeFile(outputJsonFile, nlJsonContent + '\n');

	const totalTranslations = existingTranslationKeys.length + addedTranslationKeys.length;

	console.info(`Wrote ${totalTranslations} to ${outputJsonFile}`);
	console.info(`\t${addedTranslationKeys.length} translations added`);
	console.info(`\t${removedTranslationKeys.length} translations deleted`);

	return combinedTranslationEntries;
}

async function updateTranslations(
	rootFolderPath: string,
	app: App,
	component: Component,
	outputJsonFile: string
): Promise<TranslationEntry[]> {
	try {
		const onlineTranslations = (await getOnlineTranslations(app)).filter(
			(t) => t.component === component
		);

		const nlJsonTranslations: Record<string, string> = JSON.parse(
			(await fs.readFile(path.resolve(rootFolderPath, outputJsonFile))).toString()
		);
		const nlJsonTranslationEntries = Object.entries(nlJsonTranslations).map(
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

		// Extract translations from code and replace code by reference to translation key
		const codeFiles = await getFilesByGlob(rootFolderPath);
		const sourceCodeTranslations = await extractTranslationsFromCodeFiles(
			rootFolderPath,
			codeFiles,
			app,
			component,
			nlJsonTranslations
		);

		return await combineTranslations(
			nlJsonTranslationEntries,
			sourceCodeTranslations,
			onlineTranslations,
			path.join(rootFolderPath, outputJsonFile)
		);
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

async function extractTranslations() {
	const app = process.argv[2] as App;
	if (app !== App.AVO && app !== App.HET_ARCHIEF) {
		throw new Error(
			'Translation script started with wrong "APP" parameter. Only valid values are: ["AVO", "HET_ARCHIEF"]'
		);
	}

	let allTranslations: TranslationEntry[];
	if (app === App.AVO) {
		// AVO admin-core
		console.info('Extracting AVO admin-core translations...');
		const avoAdminCoreTranslations = await updateTranslations(
			path.resolve(__dirname, '../src/react-admin'),
			App.AVO,
			Component.ADMIN_CORE,
			'../shared/translations/avo/nl.json'
		);
		console.info('Formatting code');
		execSync(`cd ${path.resolve(__dirname, '..')} && npm run format`);

		// AVO client
		console.info('Extracting AVO client translations...');
		const avoClientTranslations = await updateTranslations(
			path.resolve(__dirname, '../../../avo2-client/src'),
			App.AVO,
			Component.FRONTEND,
			'shared/translations/nl.json'
		);
		console.info('Formatting code');
		execSync(`cd ${path.resolve(__dirname, '../../../avo2-client')} && npm run format`);

		// AVO proxy
		console.info('Extracting AVO admin-core translations...');
		const avoProxyTranslations = await updateTranslations(
			path.resolve(__dirname, '../../../avo2-proxy/server/src'),
			App.AVO,
			Component.BACKEND,
			'shared/translations/nl.json'
		);
		console.info('Formatting code');
		execSync(`cd ${path.resolve(__dirname, '../../../avo2-proxy/server')} && npm run format`);

		allTranslations = [
			...avoAdminCoreTranslations,
			...avoClientTranslations,
			...avoProxyTranslations,
		];
	} else {
		// HetArchief admin-core
		console.info('Extracting HET_ARCHIEF admin-core translations...');
		const hetArchiefAdminCoreTranslations = await updateTranslations(
			path.resolve(__dirname, '../src/react-admin'),
			App.HET_ARCHIEF,
			Component.ADMIN_CORE,
			'../shared/translations/hetArchief/nl.json'
		);
		console.info('Formatting code\n\n');
		execSync(`cd ${path.resolve(__dirname, '..')} && npm run format`);

		// HetArchief client
		console.info('Extracting HET_ARCHIEF client translations...');
		const hetArchiefClientTranslations = await updateTranslations(
			path.resolve(__dirname, '../../../hetarchief-client/src'),
			App.HET_ARCHIEF,
			Component.FRONTEND,
			'../public/locales/nl/common.json'
		);
		console.info('Formatting code\n\n');
		execSync(`cd ${path.resolve(__dirname, '../../../hetarchief-client')} && npm run format`);

		// HetArchief proxy
		console.info('Extracting HET_ARCHIEF proxy translations...');
		const hetArchiefProxyTranslations = await updateTranslations(
			path.resolve(__dirname, '../../../hetarchief-proxy/src'),
			App.HET_ARCHIEF,
			Component.BACKEND,
			'shared/i18n/locales/nl.json'
		);
		console.info('Formatting code\n\n');
		execSync(`cd ${path.resolve(__dirname, '../../../hetarchief-proxy')} && npm run format`);

		allTranslations = [
			...hetArchiefAdminCoreTranslations,
			...hetArchiefClientTranslations,
			...hetArchiefProxyTranslations,
		];
	}

	// Output all translations as sql file
	const sqlFilePath = path.resolve('./all-translations-' + kebabCase(app) + '.sql');
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

extractTranslations().catch((err) => {
	console.error('Extracting translations failed: ', err);
});
