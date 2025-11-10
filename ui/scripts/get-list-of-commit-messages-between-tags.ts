import { execSync } from 'node:child_process';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { red } from 'console-log-colors';
import { uniq } from 'es-toolkit';
import { getDirName } from './get-dir-name.js';

/**
 * fetch the list of commit messages between two git tags using the command:
 * git log v4.3.82..v4.4.3 --pretty=format:"%B"
 * then remove all lines that do not contain AVO- or ARC- jira ticket numbers
 * then write the file to commit_messages.txt
 *
 * @param oldTag the old git tag to compare. eg: v3.2.25
 * @param newTag the new git tag to compare. eg: v3.2.28
 */
async function getListOfCommitMessagesBetweenTags(oldTag?: string, newTag?: string): Promise<void> {
	const command = `git log ${oldTag}..${newTag} --pretty=format:%B`;
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

	// Remove all lines that do not contain AVO- or ARC- jira ticket numbers
	const jiraTicketRegex = /(AVO-\d+|ARC-\d+)/;
	const lines = result.split('\n');
	const commitLine = uniq(
		lines.filter((line) => {
			if (line.toLowerCase().includes('extract translations')) {
				return false;
			}
			if (line.toLowerCase().startsWith('merge branch')) {
				return false;
			}
			if (line.toLowerCase().startsWith('merge pull request')) {
				return false;
			}
			if (line.toLowerCase().endsWith('…')) {
				return false;
			}
			return jiraTicketRegex.test(line);
		})
	);

	// Write the simplified translations to a file
	const outputFilePath = path.join(getDirName(), `../commit-messages.txt`);
	await fs.writeFile(outputFilePath, commitLine.join('\n'), 'utf8');
}

/**
 * A command line wrapper with 2 command line arguments:
 * 2. oldTag
 * 3. newTag
 */
async function main() {
	const [oldTag, newTag] = process.argv.slice(2);
	if (!oldTag) {
		console.error('No old tag provided');
		process.exit(1);
	}
	if (!newTag) {
		console.error('No new tag provided');
		process.exit(1);
	}
	await getListOfCommitMessagesBetweenTags(oldTag, newTag);
}

main()
	.then(() => console.log('Done!'))
	.catch((error) => console.error(red(`Error: ${error.message}`)));
