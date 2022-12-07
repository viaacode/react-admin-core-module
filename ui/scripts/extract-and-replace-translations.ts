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

import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';

import glob from 'glob';
import { compact, intersection, kebabCase, keys, lowerCase, upperFirst, without } from 'lodash';
import {
	GetTranslationsDocument as GetTranslationsDocumentAvo,
	GetTranslationsQuery as GetTranslationsQueryAvo,
} from '../src/react-admin/generated/graphql-db-types-avo';

import {
	GetTranslationsDocument as GetTranslationsDocumentHetArchief,
	GetTranslationsQuery as GetTranslationsQueryHetArchief,
} from '../src/react-admin/generated/graphql-db-types-hetarchief';

import localTranslationsAvo from '../src/shared/translations/avo/nl.json';
import localTranslationsHetArchief from '../src/shared/translations/hetArchief/nl.json';

type AppsList = ('AVO' | 'HET_ARCHIEF')[];
type KeyMap = Record<string, { value: string; apps: AppsList }>;

const oldTranslationsAvo: KeyMap = Object.fromEntries(
	Object.entries(localTranslationsAvo as Record<string, string>).map(([key, value]) => [
		key,
		{
			value,
			apps: ['AVO'],
		},
	])
);
const oldTranslationsHetArchief: KeyMap = Object.fromEntries(
	Object.entries(localTranslationsHetArchief as Record<string, string>).map(([key, value]) => [
		key,
		{
			value,
			apps: ['HET_ARCHIEF'],
		},
	])
);

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

async function getFilesByGlob(globPattern: string): Promise<string[]> {
	return new Promise<string[]>((resolve, reject) => {
		const options = {
			ignore: ['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
			cwd: path.join(__dirname, '../src'),
		};
		glob(globPattern, options, (err, files) => {
			if (err) {
				reject(err);
			} else {
				resolve(files);
			}
		});
	});
}

function getFallbackTranslation(key: string): string {
	return `${upperFirst(lowerCase(key.split('___').pop()))}`;
}

function extractTranslationsFromCodeFiles(codeFiles: string[]): {
	avo: KeyMap;
	hetarchief: KeyMap;
} {
	const newTranslationsAvo: KeyMap = {};
	const newTranslationsHetArchief: KeyMap = {};
	// Find and extract translations, replace strings with translation keys
	codeFiles.forEach((relativeFilePath: string) => {
		try {
			const absoluteFilePath = path.resolve(__dirname, '../src', relativeFilePath);
			const content: string = fs.readFileSync(absoluteFilePath).toString();

			// Replace tHtml() and tText() functions
			const beforeTFunction = '([^a-zA-Z])'; // eg: .
			const tFuncStart = '(tHtml|tText)\\('; // eg: tHtml
			const whitespace = '\\s*';
			const quote = '[\'"]'; // eg: "
			const translation = '([^,)]+?)'; // eg: admin/content-block/helpers/generators/klaar___voeg-titel-toe
			const translationVariables = '([\\s]*,[\\s]*\\{[^}]*\\})?'; // eg: , {}
			const appsVariable = '([\\s]*,[\\s]*\\[[^\\]]*\\])?'; // eg: , [AVO]
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
					translationParams: string | undefined,
					appsParam: string | undefined
				) => {
					let formattedKey: string | undefined;
					const apps: AppsList = compact(
						(appsParam || ', [AVO, HET_ARCHIEF]')
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
					if (apps.includes('AVO')) {
						if (hasKeyAlready && !(oldTranslationsAvo as KeyMap)[formattedKey]) {
							console.error(
								'Failed to find old translation in /avo/nl.json for key: ',
								formattedKey
							);
						}
						newTranslationsAvo[formattedKey] = {
							value:
								(hasKeyAlready
									? getFormattedTranslation(
											(oldTranslationsAvo as KeyMap)[formattedKey]?.value ||
												getFallbackTranslation(formattedKey)
									  )
									: formattedTranslation) || '',
							apps,
						};
					}
					if (apps.includes('HET_ARCHIEF')) {
						if (hasKeyAlready && !(oldTranslationsHetArchief as KeyMap)[formattedKey]) {
							console.error(
								'Failed to find old translation /hetArchief/nl.json for key: ',
								formattedKey
							);
						}
						newTranslationsHetArchief[formattedKey] = {
							value:
								(hasKeyAlready
									? getFormattedTranslation(
											(oldTranslationsHetArchief as KeyMap)[formattedKey]
												?.value || getFallbackTranslation(formattedKey)
									  )
									: formattedTranslation) || '',
							apps,
						};
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
				fs.writeFileSync(absoluteFilePath, newContent);
			}
		} catch (err) {
			console.error(`Failed to find translations in file: ${relativeFilePath}`, err);
		}
	});
	return { avo: newTranslationsAvo, hetarchief: newTranslationsHetArchief };
}

async function getOnlineTranslations(): Promise<{
	avo: Record<string, string>;
	hetarchief: Record<string, string>;
}> {
	if (
		!process.env.GRAPHQL_URL_AVO ||
		!process.env.GRAPHQL_SECRET_AVO ||
		!process.env.GRAPHQL_URL_HETARCHIEF ||
		!process.env.GRAPHQL_SECRET_HETARCHIEF
	) {
		throw new Error(
			'Missing environment variables. One or more of these are missing: GRAPHQL_URL_AVO, GRAPHQL_SECRET_AVO, GRAPHQL_URL_HETARCHIEF, GRAPHQL_SECRET_HETARCHIEF'
		);
	}
	try {
		// Avo
		const avoTranslationsResponse: GetTranslationsQueryAvo = (await (
			await fetch(process.env.GRAPHQL_URL_AVO, {
				headers: {
					'x-hasura-admin-secret': process.env.GRAPHQL_SECRET_AVO,
				},
				method: 'post',
				body: JSON.stringify({
					query: GetTranslationsDocumentAvo,
				}),
			})
		).json()) as GetTranslationsQueryAvo;
		const avoAdminCoreTranslations =
			avoTranslationsResponse.app_site_variables?.find(
				(t) => t.name === 'translations-admin-core' || t.name === 'TRANSLATIONS_ADMIN_CORE'
			)?.value || {};

		// HetArchief
		const hetArchiefTranslationsResponse: GetTranslationsQueryHetArchief = (await (
			await fetch(process.env.GRAPHQL_URL_HETARCHIEF, {
				headers: {
					'x-hasura-admin-secret': process.env.GRAPHQL_SECRET_HETARCHIEF,
				},
				method: 'post',
				body: JSON.stringify({
					query: GetTranslationsDocumentHetArchief,
				}),
			})
		).json()) as GetTranslationsQueryHetArchief;
		const hetArchiefAdminCoreTranslations =
			hetArchiefTranslationsResponse.app_config?.find(
				(t) => t.name === 'translations-admin-core' || t.name === 'TRANSLATIONS_ADMIN_CORE'
			)?.value || {};

		return { avo: avoAdminCoreTranslations, hetarchief: hetArchiefAdminCoreTranslations };
	} catch (err) {
		throw new Error('Failed to get translations from the database');
	}
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

async function updateTranslations(
	oldTranslations: KeyMap,
	newTranslations: KeyMap,
	onlineTranslations: Record<string, string>,
	outputFile: string
): Promise<void> {
	// Compare existing translations to the new translations
	const oldTranslationKeys: string[] = keys(oldTranslations);
	const newTranslationKeys: string[] = keys(newTranslations);
	const addedTranslationKeys: string[] = without(newTranslationKeys, ...oldTranslationKeys);
	const removedTranslationKeys: string[] = without(oldTranslationKeys, ...newTranslationKeys);
	const existingTranslationKeys: string[] = intersection(newTranslationKeys, oldTranslationKeys);

	// Console log translations that were found in the json file but not in the code
	console.warn(`
		The following translation keys were removed:
			\t${removedTranslationKeys.map((key) => key.trim()).join('\n\t')}
	`);

	// Combine the translations in the json with the freshly extracted translations from the code
	const combinedTranslations: Record<string, string> = {};
	existingTranslationKeys.forEach((key: string) => {
		combinedTranslations[key] = onlineTranslations[key] || oldTranslations[key].value;
	});
	addedTranslationKeys.forEach((key: string) => {
		combinedTranslations[key] = onlineTranslations[key] || newTranslations[key].value;
	});

	const nlJsonContent = JSON.stringify(sortObjectKeys(combinedTranslations), null, 2);
	checkTranslationsForKeysAsValue(nlJsonContent); // Throws error if any key is found as a value

	fs.writeFileSync(outputFile, nlJsonContent + '\n');

	const totalTranslations = existingTranslationKeys.length + addedTranslationKeys.length;

	console.info(`
		Wrote ${totalTranslations} src/${outputFile.split('src').pop()} file
			\t${addedTranslationKeys.length} translations added
			\t${removedTranslationKeys.length} translations deleted
	`);
}

async function updateTranslationsForAvoAndHetArchief(): Promise<void> {
	const { avo: onlineTranslationsAvo, hetarchief: onlineTranslationsHetArchief } =
		await getOnlineTranslations();

	// Extract translations from code and replace code by reference to translation key
	const codeFiles = await getFilesByGlob('**/*.@(ts|tsx)');
	const { avo: newTranslationsAvo, hetarchief: newTranslationsHetArchief } =
		extractTranslationsFromCodeFiles(codeFiles);

	await updateTranslations(
		oldTranslationsAvo,
		newTranslationsAvo,
		onlineTranslationsAvo,
		`${__dirname.replace(/\\/g, '/')}/../src/shared/translations/avo/nl.json`
	);
	await updateTranslations(
		oldTranslationsHetArchief,
		newTranslationsHetArchief,
		onlineTranslationsHetArchief,
		`${__dirname.replace(/\\/g, '/')}/../src/shared/translations/hetArchief/nl.json`
	);
}

updateTranslationsForAvoAndHetArchief().catch((err) =>
	console.error('Update of translations failed: ', err)
);
