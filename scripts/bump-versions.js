import * as fs from 'fs';
import * as path from 'path';

// console.log(process.argv);
const arguments = process.argv.slice(2);
const packageJsonPathsRelative = arguments.slice(0, arguments.length - 1);
const type = arguments.at(-1);

console.log({ packageJsonPathsRelative, type });

const packageJsonPathsAbsolute = packageJsonPathsRelative.map((path) =>
	path.join(__dirname, '..', path)
);
const packageJsonLockPathsAbsolute = packageJsonPathsAbsolute.map((path) =>
	path.replace('.json', '-lock.json')
);

const packageJsonContents = await Promise.all(
	packageJsonPathsAbsolute.map((path) => {
		return JSON.stringify((await fs.readFile(path)).toString('utf8'));
	})
);
const packageJsonLockContents = await Promise.all(
	packageJsonLockPathsAbsolute.map((path) => {
		return JSON.stringify((await fs.readFile(path)).toString('utf8'));
	})
);

const versions = packageJsonContents.map((content) => content.version);

const parsedVersions = versions.map((versionString) =>
	versionString.split('.').map((num) => parseInt(num, 10))
);

let biggestVersion = parsedVersions.at(0);
parsedVersions.forEach(parsedV);
