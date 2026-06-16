import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { red } from 'console-log-colors';
import { kebabCase } from 'es-toolkit';
import { getDirName } from './get-dir-name';
import type { App } from './translation.types';

const GIT_CHANGE_DELETE_TRANSLATION_REGEX =
	/^-INSERT\s+INTO\s+app\.translations.*?VALUES\s*\('[^']*',\s*'([^']+)',\s*'([^']+)',/gm;
const GIT_CHANGE_ADDITION_TRANSLATION_REGEX =
	/^\+INSERT\s+INTO\s+app\.translations.*?VALUES\s*\('[^']*',\s*'([^']+)',\s*'([^']+)',/gm;

/**
 * Fetch the list of *new* translations between two git tags (i.e. translations that were added,
 * not ones whose database value was merely updated).
 *
 * Strategy:
 *   1. Run: git diff <oldTag>..<newTag> --no-ext-diff --unified=0 -a --no-prefix all-translations-<app>.sql
 *   2. Collect the location+key of every deleted row (lines starting with `-`).
 *      These represent translations whose value changed in the database — they already existed.
 *   3. Collect the location+key of every added row (lines starting with `+`).
 *      Filter out any key that also appears in the deleted set.
 *      What remains are genuinely new translation keys.
 *   4. Write the unique new keys in `location___key` format to translation-changes-<app>.txt.
 *
 * @param app AVO or HET_ARCHIEF
 * @param oldTag the old git tag to compare. eg: v3.2.25
 * @param newTag the new git tag to compare. eg: v3.2.28
 */
async function getListOfChangedTranslations(
	app: App,
	oldTag?: string,
	newTag?: string
): Promise<void> {
	const command = `git diff ${oldTag}..${newTag} --no-ext-diff --unified=0 -a --no-prefix all-translations-${kebabCase(
		app
	)}.sql`;
	let result: string;

	try {
		result = execSync(command, {
			encoding: 'utf8',
			maxBuffer: 10 * 1024 * 1024, // 10 MB
		}).toString();
	} catch (error) {
		console.error(red(`Error executing command: ${command}`));
		console.error(error);
		return;
	}

	// Extract keys from deleted row: these represent updated (not new) translations
	const deletedKeys = new Set<string>();
	let match: RegExpExecArray | null = GIT_CHANGE_DELETE_TRANSLATION_REGEX.exec(result);
	while (match !== null) {
		deletedKeys.add(`${match[1]}___${match[2]}`);
		match = GIT_CHANGE_DELETE_TRANSLATION_REGEX.exec(result);
	}

	// Extract keys from added rows: keeping only those absent from deletedKeys (truly new translations)
	const newTranslationKeys: string[] = [];
	match = GIT_CHANGE_ADDITION_TRANSLATION_REGEX.exec(result);
	while (match !== null) {
		const key = `${match[1]}___${match[2]}`;
		if (!deletedKeys.has(key)) {
			newTranslationKeys.push(key);
		}
		match = GIT_CHANGE_ADDITION_TRANSLATION_REGEX.exec(result);
	}

	// Unique keys
	const uniqueTranslations = Array.from(new Set(newTranslationKeys)).join('\n');

	// Write the simplified translations to a file
	const outputFilePath = path.join(getDirName(), `../translation-changes-${kebabCase(app)}.txt`);
	await fs.writeFile(outputFilePath, uniqueTranslations, 'utf8');
}

/**
 * A command line wrapper with 3 command line arguments:
 * 1. app (AVO or HET_ARCHIEF)
 * 2. oldTag
 * 3. newTag
 */
async function main() {
	const [app, oldTag, newTag] = process.argv.slice(2);
	if (!app) {
		console.error(red('Please provide an app (AVO or HET_ARCHIEF)'));
		process.exit(1);
	}
	if (!['AVO', 'HET_ARCHIEF'].includes(app)) {
		console.error(red('Invalid app provided. Please use AVO or HET_ARCHIEF.'));
		process.exit(1);
	}
	if (!oldTag) {
		console.error('No old tag provided');
		process.exit(1);
	}
	if (!newTag) {
		console.error('No new tag provided');
		process.exit(1);
	}
	await getListOfChangedTranslations(app as App, oldTag, newTag);
}

main()
	.then(() => console.info('Done!'))
	.catch((error) => console.error(red(`Error: ${error.message}`)));
