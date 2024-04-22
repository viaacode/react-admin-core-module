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

import * as fs from 'fs/promises';
import * as path from 'path';
import { mapLimit } from 'blend-promise-utils';
import * as glob from 'glob';
import { compact, intersection, kebabCase, lowerCase, upperFirst, without } from 'lodash';

import { executeDatabaseQuery } from './execute-database-query';

enum App {
	AVO = 'AVO',
	HET_ARCHIEF = 'HET_ARCHIEF',
}
enum Component {
	ADMIN_CORE = 'ADMIN_CORE',
	FRONTEND = 'FRONTEND',
	BACKEND = 'BACKEND',
}
type Location = string;
type Key = string;

enum ValueType {
	TEXT = 'TEXT',
	HTML = 'HTML',
}

interface TranslationEntry {
	app: App;
	component: Component;
	location: string;
	key: string;
	value: string;
	value_type: ValueType | null;
}

function getFullKey(
	translationEntry: TranslationEntry
): `${App}__${Component}__${Location}__${Key}` {
	return `${translationEntry.app}__${translationEntry.component}__${translationEntry.location}__${translationEntry.key}`;
}

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

		return `${fileKey}___${formattedKey}`;
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
	return `${upperFirst(lowerCase(key.split('___').pop()))}`;
}

function extractTranslationsFromCodeFiles(
	rootFolderPath: string,
	codeFiles: string[],
	app: App,
	component: Component,
	oldTranslations: Record<string, string>
): TranslationEntry[] {
	const newTranslations: TranslationEntry[] = [];
	// Find and extract translations, replace strings with translation keys
	mapLimit(codeFiles, 20, async (relativeFilePath: string) => {
		try {
			const absoluteFilePath = path.resolve(rootFolderPath, relativeFilePath);
			const content: string = (await fs.readFile(absoluteFilePath)).toString();

			// Replace tHtml() and tText() functions
			const beforeTFunction = '([^a-zA-Z])'; // eg: .
			const tFuncStart = '(tHtml|tText)\\('; // eg: tHtml
			const whitespace = '\\s*';
			const quote = '[\'"]'; // eg: "
			const translation = '([^,)]+?)'; // eg: admin/content-block/helpers/generators/klaar___voeg-titel-toe
			const translationVariables = '([\\s]*,[\\s]*(\\{[^}]*\\}|undefined))?'; // eg: , {numberOfPeople: 5} or , undefined
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
					tFunction: string,
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
					if (formattedTranslation.includes('___')) {
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
					const hasKeyAlready = formattedTranslation.includes('___');
					if (apps.includes(app)) {
						if (hasKeyAlready && !oldTranslations[formattedKey]) {
							console.error(
								`Failed to find old translation in ${app}/nl.json for key: `,
								formattedKey
							);
						}
						const location = formattedKey.split('___')[0];
						const key = formattedKey.split('___')[1];

						newTranslations.push({
							app: App.AVO,
							component,
							location,
							key,
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
						return `${prefix}${tFunction}('${formattedKey}'${translationParams || ''}${
							appsParam || ''
						})`;
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
	return newTranslations;
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
	return response.data.app_translations;
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
	oldTranslations: TranslationEntry[],
	newTranslations: TranslationEntry[],
	onlineTranslations: TranslationEntry[],
	outputFile: string
): Promise<TranslationEntry[]> {
	// Compare existing translations to the new translations
	const oldTranslationKeys: string[] = oldTranslations.map(getFullKey);
	const newTranslationKeys: string[] = newTranslations.map(getFullKey);
	const addedTranslationKeys: string[] = without(newTranslationKeys, ...oldTranslationKeys);
	const removedTranslationKeys: string[] = without(oldTranslationKeys, ...newTranslationKeys);
	const existingTranslationKeys: string[] = intersection(newTranslationKeys, oldTranslationKeys);

	// Console log translations that were found in the json file but not in the code
	console.warn(`
		The following translation keys were removed:
			\t${removedTranslationKeys.map((key) => key.trim()).join('\n\t')}
	`);

	// Combine the translations in the json with the freshly extracted translations from the code
	const combinedTranslationEntries: TranslationEntry[] = [];
	existingTranslationKeys.forEach((translationKey: string) => {
		const entry =
			onlineTranslations.find((t) => getFullKey(t) === translationKey) ||
			(oldTranslations.find((t) => getFullKey(t) === translationKey) as TranslationEntry);
		if (entry) {
			combinedTranslationEntries.push(entry);
		} else {
			throw new Error(
				'Failed to find translation in old and in online translations: ' + translationKey
			);
		}
	});
	addedTranslationKeys.forEach((translationKey: string) => {
		const entry =
			onlineTranslations.find((t) => getFullKey(t) === translationKey) ||
			(newTranslations.find((t) => getFullKey(t) === translationKey) as TranslationEntry);
		if (entry) {
			combinedTranslationEntries.push(entry);
		} else {
			throw new Error(
				'Failed to find translation in new and in online translations: ' + translationKey
			);
		}
	});

	const combinedTranslations = Object.fromEntries(
		combinedTranslationEntries.map((entry) => [getFullKey(entry), entry.value])
	);
	const nlJsonContent = JSON.stringify(sortObjectKeys(combinedTranslations), null, 2);
	checkTranslationsForKeysAsValue(nlJsonContent); // Throws error if any key is found as a value

	await fs.writeFile(outputFile, nlJsonContent + '\n');

	const totalTranslations = existingTranslationKeys.length + addedTranslationKeys.length;

	console.info(`
		Wrote ${totalTranslations} src/${outputFile.split('src').pop()} file
			\t${addedTranslationKeys.length} translations added
			\t${removedTranslationKeys.length} translations deleted
	`);

	return combinedTranslationEntries;
}

async function updateTranslations(
	rootFolderPath: string,
	app: App,
	component: Component,
	outputJsonFile: string
): Promise<TranslationEntry[]> {
	const onlineTranslations = await getOnlineTranslations(app);

	const oldTranslations: Record<string, string> = JSON.parse(
		(await fs.readFile(outputJsonFile)).toString()
	);
	const oldTranslationEntries = Object.entries(oldTranslations).map((entry): TranslationEntry => {
		return {
			app,
			component,
			location: entry[0].split('___')[0],
			key: entry[0].split('___')[1],
			value: entry[1],
			value_type: null,
		};
	});

	// Extract translations from code and replace code by reference to translation key
	const codeFiles = await getFilesByGlob(rootFolderPath + '/src');
	const newTranslations = extractTranslationsFromCodeFiles(
		rootFolderPath,
		codeFiles,
		app,
		component,
		oldTranslations
	);

	return await combineTranslations(
		oldTranslationEntries,
		newTranslations,
		onlineTranslations,
		outputJsonFile
	);
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
			'hared/translations/avo/nl.json'
		);

		// AVO client
		console.info('Extracting AVO client translations...');
		const avoClientTranslations = await updateTranslations(
			path.resolve(__dirname, '../../avo2-client/src'),
			App.AVO,
			Component.FRONTEND,
			'shared/translations/nl.json'
		);

		// AVO proxy
		console.info('Extracting AVO admin-core translations...');
		const avoProxyTranslations = await updateTranslations(
			path.resolve(__dirname, '../../avo2-proxy/server/src'),
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
		const hetArchiefAdminCoreTranslations = await updateTranslations(
			path.resolve(__dirname, '../src/react-admin'),
			App.HET_ARCHIEF,
			Component.ADMIN_CORE,
			'shared/translations/hetArchief/nl.json'
		);

		// HetArchief client
		const hetArchiefClientTranslations = await updateTranslations(
			path.resolve(__dirname, '../../hetarchief-client/src'),
			App.HET_ARCHIEF,
			Component.FRONTEND,
			'../public/locales/nl/common.json'
		);

		// HetArchief proxy
		const hetArchiefProxyTranslations = await updateTranslations(
			path.resolve(__dirname, '../../hetarchief-proxy/src'),
			App.HET_ARCHIEF,
			Component.BACKEND,
			'shared/translations/nl.json'
		);

		allTranslations = [
			...hetArchiefAdminCoreTranslations,
			...hetArchiefClientTranslations,
			...hetArchiefProxyTranslations,
		];
	}

	// Output all translations as sql file
	let sql: string = allTranslations
		.map((translationEntry) => {
			return `INSERT INTO app.translations (component, location, key, value, value_type) VALUES (${translationEntry.component}, ${translationEntry.location}, ${translationEntry.key}, ${translationEntry.value}, ${translationEntry.value_type}) ON CONFLICT (id) DO UPDATE SET value = ${translationEntry.value}, value_type = ${translationEntry.value_type};`;
		})
		.join('\n');
	sql = 'TRUNCATE app.translations;\n' + sql;
	await fs.writeFile('./all-translations-' + app + '.sql', sql);
}

extractTranslations().catch((err) => console.error('Update of translations failed: ', err));
