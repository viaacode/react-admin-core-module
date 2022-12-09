// tslint:disable:no-console
/**
 * This script runs over all files that match *.graphql and extracts the gql queries and outputs them to the client-whitelist.json file in /scripts
 */
import glob from 'glob';
import * as path from 'path';
import * as fs from 'fs-extra';

const extractNameRegex = /(query|mutation) ([^\s(]+)(.*)/gm;

function extractQueriesFromCode(globPattern: string, outputFileName: string) {
	const options = {
		cwd: path.join(__dirname, '../src/react-admin'),
	};

	glob(globPattern, options, async (err: any, files: string[]) => {
		const queries: { [queryName: string]: string } = {};

		try {
			if (err) {
				console.error('Failed to find files using **/*.graphql', err);
				return;
			}

			// Find and extract queries
			files.forEach((relativeFilePath: string) => {
				try {
					const absoluteFilePath = `${options.cwd}/${relativeFilePath}`;
					const content: string = fs.readFileSync(absoluteFilePath).toString();

					let matches: RegExpExecArray | null;
					do {
						matches = extractNameRegex.exec(content);
						if (matches) {
							const name = matches[2];
							const query = content;

							if (queries[name]) {
								console.error(
									`Query with the same variable name is found twice. This will cause a conflicts in the query whitelist: ${name}`
								);
							}

							// Remove new lines and tabs
							// Trim whitespace
							queries[name] = query.replace(/[\t\r\n]+/gm, ' ').trim();
						}
					} while (matches);
				} catch (err) {
					console.error(`Failed to find queries in file: ${relativeFilePath}`, err);
				}
			});

			const outputFile = path.join(__dirname, outputFileName);

			await fs.writeFile(outputFile, JSON.stringify(queries, null, 2));

			console.info(
				`Found ${
					Object.keys(queries).length
				} queries, outputted to: ${outputFile}. Copy this file to /scripts folder in the avo2 proxy`
			);
		} catch (err) {
			console.error('Failed to extract graphql query whitelist', JSON.stringify(err));
		}
	});
}

extractQueriesFromCode('**/hetarchief/*.graphql', 'admin-core-whitelist-hetarchief.json');
extractQueriesFromCode('**/avo/*.graphql', 'admin-core-whitelist-avo.json');
// tslint:enable:no-console
