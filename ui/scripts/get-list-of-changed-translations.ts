import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { red } from 'console-log-colors';
import { kebabCase } from 'es-toolkit';
import { getDirName } from './get-dir-name.js';
import type { App } from './translation.types.js';

/**
 * fetch the list of changed translations between two git tags using the command:
 * git diff v4.3.80..v4.3.82 --no-ext-diff --unified=0 --exit-code -a --no-prefix all-translations-het-archief.sql
 * then replace this regex: ^(@@|-).*?\n with an empty string
 * then replace this regex: ^\+INSERT\s+INTO\s+app\.translations.*?VALUES\s*\('[^']*',\s*'([^']+)',\s*'([^']+)',.*$ with $1___$2
 * then write the file to translation-changes.txt
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

	// Remove all lines that start with @@ or - (the diff headers)
	// Only keep the additions (lines starting with +)
	const additionsOnlyRegex = /^(@@|-).*?\n/gm;
	const additions = result.replaceAll(additionsOnlyRegex, '');

	// Trim the first 3 lines
	const additionsWithoutFirstThree = additions.split('\n').slice(3).join('\n');

	// Convert the sql to simple translation keys of shape location___key
	const simplifyTranslationKeysRegex =
		/(\n|^)\+INSERT\s+INTO\s+app\.translations.*?VALUES\s*\('[^']*',\s*'([^']+)',\s*'([^']+)',.*?(\r|\n|$)/gm;
	const simplifiedTranslations = additionsWithoutFirstThree.replaceAll(
		simplifyTranslationKeysRegex,
		(_wholeString, _unused, location, key) => {
			return `${location}___${key}\n`;
		}
	);

	// Unique lines
	let uniqueTranslations = Array.from(
		new Set(simplifiedTranslations.split('\n').filter(Boolean))
	).join('\n');
	uniqueTranslations = uniqueTranslations.replace('\\ No newline at end of file', '');

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
	.then(() => console.log('Done!'))
	.catch((error) => console.error(red(`Error: ${error.message}`)));
