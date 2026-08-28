// noinspection ES6PreferShortImport

import { exec } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { promisify } from 'node:util';
import cliProgress from 'cli-progress';
import { green, grey, red, yellow } from 'console-log-colors';
import { compact, intersection, kebabCase, lowerCase, upperFirst, without } from 'es-toolkit';
import { trim } from 'es-toolkit/compat';

const execAsync = promisify(exec);

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
import { Node, Project, SyntaxKind } from 'ts-morph';
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

type ProgressCallback = (pct: number, status: string) => void;

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

function escapeForRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Lowercases and strips everything that isn't a letter or a number, so that the words a variable
 * was flattened into can be compared to the variable name itself: `user name` === `userName`.
 */
function normalizeForComparison(text: string): string {
	return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

/**
 * Returns the names of the interpolation variables passed to a tText/tHtml call, eg: ['userName']
 * for tText('Hallo {{userName}}', { userName: user.name }).
 *
 * Only object literals are inspected: a variable, spread or ternary tells us nothing about which
 * placeholders the translation should contain, so those return an empty list and are never reported
 * as broken.
 */
export function extractInterpolationVariables(interpolationParam: Node | undefined): string[] {
	if (!interpolationParam || !Node.isObjectLiteralExpression(interpolationParam)) {
		return [];
	}
	return compact(
		interpolationParam.getProperties().map((property) => {
			if (!Node.isPropertyAssignment(property) && !Node.isShorthandPropertyAssignment(property)) {
				// Spread assignments and methods have no name we can use
				return null;
			}
			const nameNode = property.getNameNode();
			if (
				Node.isIdentifier(nameNode) ||
				Node.isStringLiteral(nameNode) ||
				Node.isNoSubstitutionTemplateLiteral(nameNode)
			) {
				return trim(nameNode.getText(), '\'"`');
			}
			// Computed property names ([key]) resolve at runtime
			return null;
		})
	);
}

/**
 * Restores `{{variable}}` placeholders that were flattened into plain words.
 *
 * A translation key is built with `kebabCase`, which drops the `{{}}` braces and the camelCase:
 * `Hallo {{userName}}` becomes `...___hallo-user-name`. Any value derived from such a key (or any
 * value that was written by an earlier run of this script) therefore reads `Hallo user name` and no
 * longer interpolates. This function finds the words a variable was turned into and puts the
 * placeholder back.
 *
 * Variables that are still intact are left alone, and variables whose words cannot be found are
 * returned in `missing` so the caller can report them instead of writing a broken value.
 *
 * @param value - The translation value to check.
 * @param variables - The interpolation variable names taken from the tText/tHtml call.
 */
export function ensureVariablesInValue(
	value: string,
	variables: string[]
): { value: string; missing: string[] } {
	const missing: string[] = [];
	let result = value;

	for (const variableName of variables) {
		if (new RegExp(`\\{\\{\\s*${escapeForRegex(variableName)}\\s*\\}\\}`, 'i').test(result)) {
			// Placeholder is still intact
			continue;
		}

		const normalizedVariable = normalizeForComparison(variableName);
		// kebabCase tells us into how many words the variable was flattened, eg: 'selectedUserGroup'
		// => 'selected-user-group' => 3. Only phrases of exactly that length can be its remains,
		// which keeps a variable from swallowing unrelated words.
		const wordCount = kebabCase(variableName).split('-').length;
		const words = result.split(/\s+/);
		let replaced = false;

		for (let start = 0; start + wordCount <= words.length; start++) {
			const phrase = words.slice(start, start + wordCount).join(' ');
			if (normalizeForComparison(phrase) !== normalizedVariable) {
				continue;
			}
			// Keep any punctuation that is glued to the phrase, eg: 'menu name.' => '{{menuName}}.'
			const prefix = (phrase.match(/^[^\p{L}\p{N}]*/u) as RegExpMatchArray)[0];
			const suffix = (phrase.match(/[^\p{L}\p{N}]*$/u) as RegExpMatchArray)[0];
			// Replace every occurrence, a variable can be used more than once in one translation
			const replacedResult = result.replace(
				new RegExp(escapeForRegex(phrase), 'gi'),
				`${prefix}{{${variableName}}}${suffix}`
			);
			if (replacedResult !== result) {
				result = replacedResult;
				replaced = true;
				break;
			}
		}

		if (!replaced) {
			missing.push(variableName);
		}
	}

	return { value: result, missing };
}

/**
 * Whether a value ended up using at least one of the variables the code passes to it.
 *
 * Not every variable has to appear: a translation may use only some of them (eg: a count that is
 * only mentioned in the plural wording), so a value is only considered broken when none of its
 * variables made it in.
 *
 * @param missing - The variables that `ensureVariablesInValue` could not find or restore.
 * @param variables - All variables the tText/tHtml call passes.
 */
export function usesAnyVariable(missing: string[], variables: string[]): boolean {
	return missing.length < variables.length;
}

function getFallbackTranslation(key: string, variables: string[] = []): string {
	const fallback = `${upperFirst(lowerCase(key.split(TRANSLATION_SEPARATOR).pop() as string))}`;
	return ensureVariablesInValue(fallback, variables).value;
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

/**
 * The admin-core code is shared between AVO and hetArchief, but each app keeps its own translation
 * json file. When a key is missing from this app's file, the other app's file is a far better source
 * than a value reconstructed from the key, since it still holds the original punctuation, casing and
 * placeholders.
 *
 * Rejected only when it uses none of the variables the code passes, so a value that another app
 * completely flattened cannot spread.
 */
function getSiblingTranslation(
	siblingValue: string | undefined,
	variables: string[]
): string | undefined {
	if (!siblingValue) {
		return undefined;
	}
	const { missing } = ensureVariablesInValue(siblingValue, variables);
	return usesAnyVariable(missing, variables) ? siblingValue : undefined;
}

function getTranslationEntryFromCallExpression(
	tFunction: 'tText' | 'tHtml',
	translationTextOrKey: string,
	appsParam: string | undefined,
	interpolationParam: Node | undefined,
	app: App,
	component: Component,
	relativeFilePath: string,
	oldTranslations: Record<string, string>,
	oldTranslationsPath: string,
	siblingTranslations: Record<string, string>
): TranslationEntry | null {
	let formattedKey: string | undefined;
	let resolvedAppParam = appsParam;
	if (
		resolvedAppParam &&
		!resolvedAppParam.includes(App.AVO) &&
		!resolvedAppParam.includes(App.HET_ARCHIEF)
	) {
		// hetarchief proxy uses the third parameter to specify the language of the app
		resolvedAppParam = app;
	}
	const apps: AppsList = compact(
		(resolvedAppParam || ALL_APPS)
			.replace(/[[\]]/g, '')
			.replace('App.HET_ARCHIEF', App.HET_ARCHIEF)
			.replace('App.AVO', App.AVO)
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

		const variables = extractInterpolationVariables(interpolationParam);
		return {
			id: '',
			app,
			component,
			location,
			key,
			language: Locale.Nl,
			value:
				(hasKeyAlready
					? getFormattedTranslation(
							oldTranslations[formattedKey] ||
								getSiblingTranslation(siblingTranslations[formattedKey], variables) ||
								getFallbackTranslation(formattedKey, variables)
						)
					: formattedTranslation) || '',
			value_type: tFunction === 'tHtml' ? ValueType.HTML : ValueType.TEXT,
			variables,
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
	siblingTranslations: Record<string, string>,
	tsConfigFilePath?: string,
	onProgress?: ProgressCallback
): Promise<TranslationEntry[]> {
	const tsProject = new Project({
		tsConfigFilePath,
	});

	const sourceCodeTranslations: TranslationEntry[] = [];
	const sourceFiles = tsProject.getSourceFiles().filter((sourceFile) => {
		return (
			(sourceFile.getBaseName().endsWith('.ts') || sourceFile.getBaseName().endsWith('.tsx')) &&
			!sourceFile.getBaseNameWithoutExtension().includes('.test') &&
			!sourceFile.getBaseNameWithoutExtension().includes('.spec') &&
			!sourceFile.isDeclarationFile() &&
			sourceFile.getFilePath().startsWith(rootFolderPath)
		);
	});

	const total = sourceFiles.length;
	for (let i = 0; i < total; i++) {
		const sourceFile = sourceFiles[i];
		onProgress?.(10 + Math.round(((i + 1) / total) * 70), sourceFile.getBaseName());

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
				functionParameters[1],
				app,
				component,
				sourceFile.getFilePath().substring(rootFolderPath.length + 1),
				oldTranslations,
				oldTranslationsJsonPath,
				siblingTranslations
			);

			if (translationEntry) {
				firstParameter.replaceWithText(`'${getKeyWithoutComponent(translationEntry)}'`);
				sourceCodeTranslations.push(translationEntry);
			}
		});
	}
	onProgress?.(85, 'saving...');
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

interface BrokenVariableFinding {
	fullKey: string;
	language: Locale;
	value: string;
	missing: string[];
	source: 'online' | 'json' | 'code';
	siblingValue?: string;
}

// console-log-colors has no orange, and the report has to stand out from the yellow warnings
const ORANGE = '\x1b[38;5;208m';
const ORANGE_RESET = '\x1b[0m';
const orange = (text: string) => `${ORANGE}${text}${ORANGE_RESET}`;

/**
 * Lists the translations that no longer interpolate any of their variables, so they can be corrected
 * by hand. Never throws: online values are curated by meemoo and are always used as-is, we can only
 * point at them.
 */
function reportBrokenInterpolationVariables(
	findings: BrokenVariableFinding[],
	outputJsonFile: string
) {
	if (findings.length === 0) {
		return;
	}
	const onlineFindings = findings.filter((finding) => finding.source === 'online');
	console.warn(
		orange(
			`\n${findings.length} translation(s) no longer use any of their {{variables}} and have to be fixed by hand (${outputJsonFile}):`
		)
	);
	if (onlineFindings.length > 0) {
		console.warn(
			orange(
				`\t${onlineFindings.length} of them come from the online translations. Since online values always win, those have to be corrected in the QAS app_translations table.`
			)
		);
	}
	for (const finding of findings) {
		console.warn(orange(`\n\t${finding.fullKey} [${finding.language}, from ${finding.source}]`));
		console.warn(orange(`\t\tmissing:  ${finding.missing.map((v) => `{{${v}}}`).join(', ')}`));
		console.warn(orange(`\t\tvalue:    ${finding.value}`));
		if (finding.siblingValue) {
			console.warn(orange(`\t\tother app: ${finding.siblingValue}`));
		}
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
	app: App,
	siblingTranslations: Record<string, string>
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
	const brokenVariableFindings: BrokenVariableFinding[] = [];
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
				id: '',
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

			// Make sure the value still interpolates the variables that the code passes to it. Values
			// that we generated ourselves are repaired, online values are curated by meemoo so those
			// are only reported. Since variables can be optional, only a value that uses none of them
			// is reported as broken.
			const requiredVariables = sourceCodeTranslation?.variables || [];
			if (requiredVariables.length > 0 && entry.value) {
				const source: BrokenVariableFinding['source'] = onlineTranslation?.value
					? 'online'
					: nlJsonTranslation?.value
						? 'json'
						: 'code';
				const { value, missing } = ensureVariablesInValue(entry.value, requiredVariables);
				if (source !== 'online') {
					entry.value = value;
				}
				if (!usesAnyVariable(missing, requiredVariables)) {
					brokenVariableFindings.push({
						fullKey: translationKey,
						language: languageCode,
						value: entry.value,
						missing,
						source,
						siblingValue: siblingTranslations[getKeyWithoutComponent(entry)],
					});
				}
			}

			combinedTranslationEntries.push(entry);
		});
	});

	const combinedTranslations = Object.fromEntries(
		combinedTranslationEntries
			.filter((entry) => entry.language === Locale.Nl)
			.map((entry) => [entry.location + TRANSLATION_SEPARATOR + entry.key, entry.value])
	);
	const nlJsonContent = JSON.stringify(sortObjectKeys(combinedTranslations), null, 2);
	reportBrokenInterpolationVariables(brokenVariableFindings, outputJsonFile); // Only warns
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

/**
 * Reads the translation json of the other app that shares this code. Never fatal: without it we
 * simply fall back to reconstructing values from the key.
 */
async function readSiblingTranslations(siblingJsonPath: string): Promise<Record<string, string>> {
	try {
		return JSON.parse((await fs.readFile(siblingJsonPath)).toString());
	} catch {
		console.warn(
			yellow(
				`Could not read the sibling app translations at ${siblingJsonPath}, falling back to translations derived from the key`
			)
		);
		return {};
	}
}

async function updateTranslations(
	rootFolderPath: string,
	app: App,
	component: Component,
	outputJsonFile: string,
	allOnlineTranslations: TranslationEntry[],
	tsConfigPath?: string,
	onProgress?: ProgressCallback,
	siblingJsonFile?: string
): Promise<TranslationEntry[]> {
	try {
		const onlineTranslations = allOnlineTranslations.filter((t) => t.component === component);

		onProgress?.(5, 'reading existing translations...');
		const nlJsonTranslations: Record<string, string> = JSON.parse(
			(await fs.readFile(path.resolve(rootFolderPath, outputJsonFile))).toString()
		);
		const nlJsonTranslationEntries = Object.entries(nlJsonTranslations).map(
			(entry): TranslationEntry => {
				return {
					id: '',
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

		const siblingTranslations = siblingJsonFile
			? await readSiblingTranslations(path.resolve(rootFolderPath, siblingJsonFile))
			: {};

		// Extract translations from code and replace code by reference to translation key
		const sourceCodeTranslations = await extractTranslationsFromCodeFiles(
			rootFolderPath,
			app,
			component,
			nlJsonTranslations,
			resolvePath(rootFolderPath, outputJsonFile),
			siblingTranslations,
			tsConfigPath,
			onProgress
		);

		onProgress?.(90, 'combining translations...');
		const result = await combineTranslations(
			nlJsonTranslationEntries,
			sourceCodeTranslations,
			onlineTranslations,
			path.join(rootFolderPath, outputJsonFile),
			app,
			siblingTranslations
		);
		onProgress?.(95, 'done');
		return result;
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

async function formatCode(codePath: string) {
	await execAsync('npm run format', { cwd: codePath });
}

async function extractAvoAdminCoreTranslations(
	allOnlineTranslations: TranslationEntry[],
	onProgress?: ProgressCallback
) {
	const translations = await updateTranslations(
		resolvePath('../src/react-admin'),
		App.AVO,
		Component.ADMIN_CORE,
		'../shared/translations/avo/nl.json',
		allOnlineTranslations,
		resolvePath('../tsconfig.json'),
		onProgress,
		'../shared/translations/hetArchief/nl.json'
	);
	onProgress?.(97, 'formatting...');
	await formatCode(resolvePath('../'));
	onProgress?.(100, 'done');
	return translations;
}

async function extractAvoClientTranslations(
	allOnlineTranslations: TranslationEntry[],
	onProgress?: ProgressCallback
) {
	const translations = await updateTranslations(
		resolvePath('../../../avo2-client/src'),
		App.AVO,
		Component.FRONTEND,
		'shared/translations/nl.json',
		allOnlineTranslations,
		resolvePath('../../../avo2-client/tsconfig.json'),
		onProgress
	);
	onProgress?.(97, 'formatting...');
	await formatCode(resolvePath('../../../avo2-client'));
	onProgress?.(100, 'done');
	return translations;
}

async function extractAvoProxyTranslations(
	allOnlineTranslations: TranslationEntry[],
	onProgress?: ProgressCallback
) {
	const translations = await updateTranslations(
		resolvePath('../../../avo2-proxy/server/src'),
		App.AVO,
		Component.BACKEND,
		'shared/translations/nl.json',
		allOnlineTranslations,
		resolvePath('../../../avo2-proxy/server/tsconfig.json'),
		onProgress
	);
	onProgress?.(97, 'formatting...');
	await formatCode(resolvePath('../../../avo2-proxy/server'));
	onProgress?.(100, 'done');
	return translations;
}

async function extractHetArchiefAdminCoreTranslations(
	allOnlineTranslations: TranslationEntry[],
	onProgress?: ProgressCallback
) {
	const translations = await updateTranslations(
		resolvePath('../src/react-admin'),
		App.HET_ARCHIEF,
		Component.ADMIN_CORE,
		'../shared/translations/hetArchief/nl.json',
		allOnlineTranslations,
		resolvePath('../tsconfig.json'),
		onProgress,
		'../shared/translations/avo/nl.json'
	);
	onProgress?.(97, 'formatting...');
	await formatCode(resolvePath('../'));
	onProgress?.(100, 'done');
	return translations;
}

async function extractHetArchiefClientTranslations(
	allOnlineTranslations: TranslationEntry[],
	onProgress?: ProgressCallback
) {
	const translations = await updateTranslations(
		resolvePath('../../../hetarchief-client/src'),
		App.HET_ARCHIEF,
		Component.FRONTEND,
		'../public/locales/nl/common.json',
		allOnlineTranslations,
		resolvePath('../../../hetarchief-client/tsconfig.json'),
		onProgress
	);
	onProgress?.(97, 'formatting...');
	await formatCode(resolvePath('../../../hetarchief-client'));
	onProgress?.(100, 'done');
	return translations;
}

async function extractHetArchiefProxyTranslations(
	allOnlineTranslations: TranslationEntry[],
	onProgress?: ProgressCallback
) {
	const translations = await updateTranslations(
		resolvePath('../../../hetarchief-proxy/src'),
		App.HET_ARCHIEF,
		Component.BACKEND,
		'shared/i18n/locales/nl.json',
		allOnlineTranslations,
		resolvePath('../../../hetarchief-proxy/tsconfig.json'),
		onProgress
	);
	onProgress?.(97, 'formatting...');
	await formatCode(resolvePath('../../../hetarchief-proxy'));
	onProgress?.(100, 'done');
	return translations;
}

async function extractTranslations() {
	const app = process.argv[2] as App;
	if (app !== App.AVO && app !== App.HET_ARCHIEF) {
		throw new Error(
			'Translation script started with wrong "APP" parameter. Only valid values are: ["AVO", "HET_ARCHIEF"]'
		);
	}

	const labels =
		app === App.AVO
			? ['admin-core', 'avo-client', 'avo-proxy']
			: ['admin-core', 'hetarchief-client', 'hetarchief-proxy'];

	const labelWidth = Math.max('total'.length, ...labels.map((l) => l.length));
	const pad = (s: string) => s.padEnd(labelWidth);
	const pct = (n: number) => `${String(n).padStart(3)}%`;

	const multiBar = new cliProgress.MultiBar(
		{
			clearOnComplete: false,
			hideCursor: true,
			format: ' {bar} {pct} | {label} | {status}',
		},
		cliProgress.Presets.shades_classic
	);

	const DIM = '\x1b[2m';
	const RESET = '\x1b[0m';
	const dimFormat = ` ${DIM}{bar} {pct} | {label} | {status}${RESET}`;

	const totalBar = multiBar.create(100, 0, {
		pct: pct(0),
		label: pad('total'),
		status: 'fetching online translations...',
	});
	const bars = labels.map((label) =>
		multiBar.create(
			100,
			0,
			{ pct: pct(0), label: pad(label), status: 'waiting...' },
			{ format: dimFormat }
		)
	);

	// Track each bar's percentage so we can compute a total
	const pcts = [0, 0, 0];
	const makeOnProgress =
		(index: number): ProgressCallback =>
		(value, status) => {
			pcts[index] = value;
			bars[index].update(value, { pct: pct(value), label: pad(labels[index]), status });
			const total = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
			totalBar.update(total, {
				pct: pct(total),
				label: pad('total'),
				status: `${pcts.filter((p) => p === 100).length}/${pcts.length} done`,
			});
		};

	// Buffer console output so it doesn't trample the progress bars mid-render
	const logBuffer: string[] = [];
	const origLog = console.log.bind(console);
	const origInfo = console.info.bind(console);
	const origWarn = console.warn.bind(console);
	const origError = console.error.bind(console);
	// biome-ignore lint/suspicious/noExplicitAny: intentional console override
	const capture = (...args: any[]) => logBuffer.push(args.map(String).join(' '));
	console.log = capture;
	console.info = capture;
	console.warn = capture;
	console.error = capture;

	let allTranslations: TranslationEntry[] = [];
	try {
		const allOnlineTranslations = await getOnlineTranslations(app);
		totalBar.update(0, { pct: pct(0), label: pad('total'), status: '0/3 done' });

		if (app === App.AVO) {
			[...Array(3).keys()].forEach((i) => makeOnProgress(i)(0, 'starting...'));
			const [adminCore, client, proxy] = await Promise.all([
				extractAvoAdminCoreTranslations(allOnlineTranslations, makeOnProgress(0)),
				extractAvoClientTranslations(allOnlineTranslations, makeOnProgress(1)),
				extractAvoProxyTranslations(allOnlineTranslations, makeOnProgress(2)),
			]);
			allTranslations = [...adminCore, ...client, ...proxy];
		} else {
			// HET_ARCHIEF
			[...Array(3).keys()].forEach((i) => makeOnProgress(i)(0, 'starting...'));
			const [adminCore, client, proxy] = await Promise.all([
				extractHetArchiefAdminCoreTranslations(allOnlineTranslations, makeOnProgress(0)),
				extractHetArchiefClientTranslations(allOnlineTranslations, makeOnProgress(1)),
				extractHetArchiefProxyTranslations(allOnlineTranslations, makeOnProgress(2)),
			]);
			allTranslations = [...adminCore, ...client, ...proxy];
		}
	} finally {
		console.log = origLog;
		console.info = origInfo;
		console.warn = origWarn;
		console.error = origError;
		multiBar.stop();
		for (const msg of logBuffer) {
			origInfo(msg);
		}
	}

	// Output all translations as sql file
	const sqlFilePath = path.resolve(`./all-translations-${kebabCase(app)}.sql`);
	console.info(`Writing SQL file: ${sqlFilePath}`);
	const uniqueTranslations = [
		...new Map(
			allTranslations.map((t) => [`${t.component}|${t.location}|${t.key}|${t.language}`, t])
		).values(),
	];
	let sql: string = uniqueTranslations
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
		JSON.stringify(uniqueTranslations, null, 2)
	);
	console.info(green(`Finished writing ${uniqueTranslations.length} translations`));
}

// Only run when this file is executed directly, so tests can import the helpers above
if (process.argv[1]?.endsWith('extract-and-replace-translations.ts')) {
	extractTranslations().catch((err) => {
		console.error(red('Extracting translations failed: '), err);
	});
}
