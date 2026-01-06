// noinspection ES6PreferShortImport

import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { green, grey, red, yellow } from 'console-log-colors';
import { compact, intersection, kebabCase, lowerCase, trim, upperFirst, without } from 'lodash-es';
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
import { Project, SyntaxKind } from 'ts-morph';
import type { MultiLanguageTranslationEntry } from '~modules/translations/translations.types.ts';
import { executeDatabaseQuery } from './execute-database-query';
import { getDirName } from './get-dir-name';
import {
	App,
	Component,
	type Key,
	Locale,
	type Location,
	TRANSLATION_SEPARATOR,
	type TranslationEntry,
	ValueType,
} from './translation.types';

const ALL_APPS = `[${App.AVO}, ${App.HET_ARCHIEF}]`;

export function getFullKey(
	translationEntry: TranslationEntry | MultiLanguageTranslationEntry
): `${Component}${typeof TRANSLATION_SEPARATOR}${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
	return `${translationEntry.component}${TRANSLATION_SEPARATOR}${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
}

export function getKeyWithoutComponent(
	translationEntry: TranslationEntry | MultiLanguageTranslationEntry
): `${Location}${typeof TRANSLATION_SEPARATOR}${Key}` {
	return `${translationEntry.location}${TRANSLATION_SEPARATOR}${translationEntry.key}`;
}

type AppsList = (App.AVO | App.HET_ARCHIEF)[];

function getFormattedKey(filePath: string, key: string): string {
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
}

function getFormattedTranslation(translation: string) {
	if (!translation) {
		return translation;
	}
	return translation.trim().replace(/\t\t(\t)+/g, ' ');
}

function getFallbackTranslation(key: string): string {
	return `${upperFirst(lowerCase(key.split(TRANSLATION_SEPARATOR).pop()))}`;
}

function simplifyHtmlValue(value: string): string {
	if (value.startsWith('<p>') && value.endsWith('</p>')) {
		const innerValue = value.substring('<p>'.length, value.length - '</p>'.length);
		if (!innerValue.includes('<')) {
			// Html value doesn't contain any html or new lines => only save inner text
			return innerValue;
		}
	}
	return value;
}

function getTranslationEntryFromCallExpression(
	tFunction: 'tText' | 'tHtml',
	translationTextOrKey: string,
	appsParam: string | undefined,
	app: App,
	component: Component,
	relativeFilePath: string,
	oldTranslations: Record<string, string>,
	oldTranslationsPath: string
): TranslationEntry | null {
	let formattedKey: string | undefined;
	if (appsParam && !appsParam.includes(App.AVO) && !appsParam.includes(App.HET_ARCHIEF)) {
		// hetarchief proxy uses the third parameter to specify the language of the app
		appsParam = app;
	}
	const apps: AppsList = compact(
		(appsParam || ALL_APPS)
			.replace(/[[\]]/g, '')
			.split(',')
			.map((app: string) => app.trim())
	) as AppsList;
	const formattedTranslation: string = getFormattedTranslation(translationTextOrKey);
	if (formattedTranslation.includes(TRANSLATION_SEPARATOR)) {
		formattedKey = formattedTranslation;
	} else {
		formattedKey = getFormattedKey(relativeFilePath, formattedTranslation);
	}

	// If translation contains '___', use original translation, otherwise use translation found by the regexp
	const hasKeyAlready = formattedTranslation.includes(TRANSLATION_SEPARATOR);
	if (apps.includes(app)) {
		if (hasKeyAlready && !oldTranslations[formattedKey]) {
			console.error(
				red(`Failed to find old translation in ${oldTranslationsPath} for key: `),
				formattedKey
			);
		}
		const location = formattedKey.split(TRANSLATION_SEPARATOR)[0];
		const key = formattedKey.split(TRANSLATION_SEPARATOR)[1];

		return {
			app,
			component,
			location,
			key,
			language: Locale.Nl,
			value:
				(hasKeyAlready
					? getFormattedTranslation(
							oldTranslations[formattedKey] || getFallbackTranslation(formattedKey)
						)
					: formattedTranslation) || '',
			value_type: tFunction === 'tHtml' ? ValueType.HTML : ValueType.TEXT,
		};
	}
	return null;
}

async function extractTranslationsFromCodeFiles(
	rootFolderPath: string,
	app: App,
	component: Component,
	oldTranslations: Record<string, string>,
	oldTranslationsJsonPath: string,
	tsConfigFilePath?: string
): Promise<TranslationEntry[]> {
	const tsProject = new Project({
		tsConfigFilePath,
	});

	const sourceCodeTranslations: TranslationEntry[] = [];
	const sourceFiles = tsProject.getSourceFiles();
	for (const sourceFile of sourceFiles) {
		if (!(sourceFile.getBaseName().endsWith('.ts') || sourceFile.getBaseName().endsWith('.tsx'))) {
			continue; // Skip non-typescript files
		}
		if (
			sourceFile.getBaseNameWithoutExtension().includes('.test') ||
			sourceFile.getBaseNameWithoutExtension().includes('.spec') ||
			sourceFile.isDeclarationFile()
		) {
			continue; // Skip test and declaration files
		}

		if (!sourceFile.getFilePath().startsWith(rootFolderPath)) {
			continue; // Skip files outside the root folder
		}

		// Find and extract translations, replace strings with translation keys

		// Find all tHtml() and tText() function calls
		const translationFunctionCalls = sourceFile
			.getDescendantsOfKind(SyntaxKind.CallExpression)
			.filter((callExpression) => {
				const functionCallText = callExpression.getText();
				const functionName = callExpression.getFirstChild()?.getText();
				return (
					!functionCallText.includes('IGNORE_ADMIN_CORE_TRANSLATIONS_EXTRACTION') &&
					// Only accept functions where the name is tHtml or tHtml or ends with tText or tHtml
					['tText', 'tHtml'].includes(functionName?.split('.').pop() || '')
				);
			});

		// For each tText and tHtml function call, extract the translation value and replace it with a translation key
		translationFunctionCalls.forEach((callExpression) => {
			const functionCallExpressionName = callExpression.getFirstChild()?.getText() as string;
			const functionCallName = (functionCallExpressionName.endsWith('tText') ? 'tText' : 'tHtml') as
				| 'tText'
				| 'tHtml';
			const functionParametersNode = callExpression.getChildrenOfKind(SyntaxKind.SyntaxList);
			const functionParameters = functionParametersNode[0]
				.getChildren()
				.filter((child) => child.getKind() !== SyntaxKind.CommaToken);
			const firstParameter = functionParameters[0];
			if (firstParameter.getKind() !== SyntaxKind.StringLiteral) {
				console.error(
					red(
						JSON.stringify({
							message:
								'First parameter of tText and tHtml must be a literal string and not a variable or function call return.',
							additionalInfo: {
								file: sourceFile.getBaseName(),
								callExpression: callExpression.getText(),
								line: callExpression.getStartLineNumber(),
								character: callExpression.getStartLinePos(),
							},
						})
					)
				);
				return;
			}
			const params = functionParameters.map((param) => param.getText());

			const translationEntry = getTranslationEntryFromCallExpression(
				functionCallName,
				trim(firstParameter.getText(), '\'"``'),
				params[2],
				app,
				component,
				sourceFile.getFilePath().substring(rootFolderPath.length + 1),
				oldTranslations,
				oldTranslationsJsonPath
			);

			if (translationEntry) {
				firstParameter.replaceWithText(`'${getKeyWithoutComponent(translationEntry)}'`);
				sourceCodeTranslations.push(translationEntry);
			}
		});
	}
	await tsProject.save();

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
		`,
		{},
		'QAS' // Get translations from QAS v3
	);
	return response.data.app_translations.map((t: TranslationEntry) => ({
		...t,
		app,
	}));
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

// biome-ignore lint/suspicious/noExplicitAny: todo
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
	outputJsonFile: string,
	app: App
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
		console.info(`\t${removedTranslationKeys.map((key) => key.trim()).join('\n\t')}`);
	}

	// Combine the translations in the json with the freshly extracted translations from the code
	const combinedTranslationEntries: TranslationEntry[] = [];
	[...existingTranslationKeys, ...addedTranslationKeys].forEach((translationKey: string) => {
		const onlineTranslations = allOnlineTranslations.filter(
			(t) => getFullKey(t) === translationKey
		);
		const nlOnlineTranslation = onlineTranslations.find((t) => t.language === Locale.Nl);
		const nlJsonTranslation = nlJsonTranslations.find(
			(t) => getFullKey(t) === translationKey
		) as TranslationEntry;
		const sourceCodeTranslation = nlSourceCodeTranslations.find(
			(t) => getFullKey(t) === translationKey
		) as TranslationEntry;

		if (!nlOnlineTranslation && !nlJsonTranslation && !sourceCodeTranslation) {
			console.error(
				red(`Failed to find translation in online, nl.json and in code: ${translationKey}`)
			);
		}

		if (!nlOnlineTranslation && nlJsonTranslation && !sourceCodeTranslation) {
			console.error(
				red(
					'Only found translation in nl.json, not in online translations not in code: ' +
						translationKey
				)
			);
		}

		// Output translations for both 'nl' and 'en'
		const languages = app === App.AVO ? [Locale.Nl] : [Locale.Nl, Locale.En];
		languages.forEach((languageCode) => {
			const onlineTranslation = onlineTranslations.find((t) => t.language === languageCode);
			const entry: TranslationEntry = {
				app: sourceCodeTranslation?.app || nlOnlineTranslation?.app || nlJsonTranslation?.app,
				component:
					sourceCodeTranslation?.component ||
					onlineTranslation?.component ||
					nlJsonTranslation?.component,
				location:
					sourceCodeTranslation?.location ||
					onlineTranslation?.location ||
					nlJsonTranslation?.location,
				key: sourceCodeTranslation?.key || onlineTranslation?.key || nlJsonTranslation?.key,
				language: languageCode, // All source code translations are dutch, online translation can exist in 'en'' and 'nl'
				value: simplifyHtmlValue(
					onlineTranslation?.value || nlJsonTranslation?.value || sourceCodeTranslation?.value
				), // Online translations always have priority. Code translations are lowest priority
				value_type:
					sourceCodeTranslation?.value_type || onlineTranslation?.value_type || ValueType.TEXT, // translations in json file do not store the value type
			};

			combinedTranslationEntries.push(entry);
		});
	});

	const combinedTranslations = Object.fromEntries(
		combinedTranslationEntries
			.filter((entry) => entry.language === Locale.Nl)
			.map((entry) => [entry.location + TRANSLATION_SEPARATOR + entry.key, entry.value])
	);
	const nlJsonContent = JSON.stringify(sortObjectKeys(combinedTranslations), null, 2);
	checkTranslationsForKeysAsValue(nlJsonContent); // Throws error if any key is found as a value

	await fs.writeFile(outputJsonFile, `${nlJsonContent}\n`);

	const totalTranslations = existingTranslationKeys.length + addedTranslationKeys.length;

	console.info(grey(`Wrote ${totalTranslations} to ${outputJsonFile}`));
	const added = `\t${addedTranslationKeys.length} translations added`;
	console.info(addedTranslationKeys.length === 0 ? grey(added) : green(added));
	const deleted = `\t${removedTranslationKeys.length} translations deleted`;
	console.info(removedTranslationKeys.length === 0 ? grey(deleted) : yellow(deleted));

	return combinedTranslationEntries;
}

async function updateTranslations(
	rootFolderPath: string,
	app: App,
	component: Component,
	outputJsonFile: string,
	tsConfigPath?: string
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
					language: Locale.Nl,
					value: entry[1],
					value_type: null,
				};
			}
		);

		// Extract translations from code and replace code by reference to translation key
		const sourceCodeTranslations = await extractTranslationsFromCodeFiles(
			rootFolderPath,
			app,
			component,
			nlJsonTranslations,
			resolvePath(rootFolderPath, outputJsonFile),
			tsConfigPath
		);

		return await combineTranslations(
			nlJsonTranslationEntries,
			sourceCodeTranslations,
			onlineTranslations,
			path.join(rootFolderPath, outputJsonFile),
			app
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

function resolvePath(...filePaths: string[]): string {
	return path.resolve(getDirName(), ...filePaths).replace(/\\/g, '/');
}

function formatCode(path: string) {
	process.stdout.write(grey('Formatting code...'));
	execSync(`cd ${path} && npm run format`);
	console.info(green('done\n'));
}

async function extractAvoAdminCoreTranslations() {
	// AVO admin-core
	console.info('Extracting AVO admin-core translations...');
	const avoAdminCoreTranslations = await updateTranslations(
		resolvePath('../src/react-admin'),
		App.AVO,
		Component.ADMIN_CORE,
		'../shared/translations/avo/nl.json',
		resolvePath('../tsconfig.json')
	);
	formatCode(resolvePath('../'));
	return avoAdminCoreTranslations;
}

async function extractAvoClientTranslations() {
	// AVO client
	console.info('Extracting AVO client translations...');
	const avoClientTranslations = await updateTranslations(
		resolvePath('../../../avo2-client/src'),
		App.AVO,
		Component.FRONTEND,
		'shared/translations/nl.json',
		resolvePath('../../../avo2-client/tsconfig.json')
	);
	formatCode(resolvePath('../../../avo2-client'));
	return avoClientTranslations;
}

async function extractAvoProxyTranslations() {
	// AVO proxy
	console.info('Extracting AVO admin-core translations...');
	const avoProxyTranslations = await updateTranslations(
		resolvePath('../../../avo2-proxy/server/src'),
		App.AVO,
		Component.BACKEND,
		'shared/translations/nl.json',
		resolvePath('../../../avo2-proxy/server/tsconfig.json')
	);
	formatCode(resolvePath('../../../avo2-proxy/server'));
	return avoProxyTranslations;
}

async function extractHetArchiefAdminCoreTranslations() {
	// HetArchief admin-core
	console.info('Extracting HET_ARCHIEF admin-core translations...');
	const hetArchiefAdminCoreTranslations = await updateTranslations(
		resolvePath('../src/react-admin'),
		App.HET_ARCHIEF,
		Component.ADMIN_CORE,
		'../shared/translations/hetArchief/nl.json',
		resolvePath('../tsconfig.json')
	);
	formatCode(resolvePath('../'));
	return hetArchiefAdminCoreTranslations;
}

async function extractHetArchiefClientTranslations() {
	// HetArchief client
	console.info('Extracting HET_ARCHIEF client translations...');
	const hetArchiefClientTranslations = await updateTranslations(
		resolvePath('../../../hetarchief-client/src'),
		App.HET_ARCHIEF,
		Component.FRONTEND,
		'../public/locales/nl/common.json',
		resolvePath('../../../hetarchief-client/tsconfig.json')
	);
	formatCode(resolvePath('../../../hetarchief-client'));
	return hetArchiefClientTranslations;
}

async function extractHetArchiefProxyTranslations() {
	// HetArchief proxy
	console.info('Extracting HET_ARCHIEF proxy translations...');
	const hetArchiefProxyTranslations = await updateTranslations(
		resolvePath('../../../hetarchief-proxy/src'),
		App.HET_ARCHIEF,
		Component.BACKEND,
		'shared/i18n/locales/nl.json',
		resolvePath('../../../hetarchief-proxy/tsconfig.json')
	);
	formatCode(resolvePath('../../../hetarchief-proxy'));
	return hetArchiefProxyTranslations;
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
		const avoAdminCoreTranslations = await extractAvoAdminCoreTranslations();
		const avoClientTranslations = await extractAvoClientTranslations();
		const avoProxyTranslations = await extractAvoProxyTranslations();

		allTranslations = [
			...avoAdminCoreTranslations,
			...avoClientTranslations,
			...avoProxyTranslations,
		];
	} else {
		// HET_ARCHIEF
		const hetArchiefAdminCoreTranslations = await extractHetArchiefAdminCoreTranslations();
		const hetArchiefClientTranslations = await extractHetArchiefClientTranslations();
		const hetArchiefProxyTranslations = await extractHetArchiefProxyTranslations();

		allTranslations = [
			...hetArchiefAdminCoreTranslations,
			...hetArchiefClientTranslations,
			...hetArchiefProxyTranslations,
		];
	}

	// Output all translations as sql file
	const sqlFilePath = path.resolve(`./all-translations-${kebabCase(app)}.sql`);
	console.info(`Writing SQL file: ${sqlFilePath}`);
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
	sql = `TRUNCATE app.translations;\n${sql}`;
	await fs.writeFile(sqlFilePath, sql);
	console.info(`Writing json file: ${sqlFilePath.replace('.sql', '.json')}`);
	await fs.writeFile(
		sqlFilePath.replace('.sql', '.json'),
		JSON.stringify(allTranslations, null, 2)
	);
	console.info(green(`Finished writing ${allTranslations.length} translations`));
}

extractTranslations().catch((err) => {
	console.error(red('Extracting translations failed: '), err);
});
