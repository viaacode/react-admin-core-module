import * as fs from 'fs/promises';
import * as path from 'path';
import {argv} from 'node:process';

function parseVersion(versionString) {
	return versionString.split('.').map((num) => parseInt(num, 10));
}

function bumpParsedVersion(parsedVersion) {
	// Increment the version based on the passed type: major, minor, patch
	let newVersionParsed;
	switch (type) {
		case 'major':
			newVersionParsed = [parsedVersion[0] + 1, 0, 0]
			break;

		case 'minor':
			newVersionParsed = [parsedVersion[0], parsedVersion[1] + 1, 0]
			break;

		case 'patch':
			newVersionParsed = [parsedVersion[0], parsedVersion[1], parsedVersion[2] + 1];
			break;
	}
	return newVersionParsed.join('.');
}

// Parse the passed arguments
const executionPath = path.dirname(argv.at(1));
const type = argv.at(2); // major, minor, patch
const which = argv.at(3); // newest, separate
const packageJsonPathsRelative = argv.slice(4, argv.length); // eg: ./package.json

// Validation of arguments
if (!['major', 'minor', 'patch'].includes(type)) {
	throw new Error(`Argument "type" has an unexpected value: ${type}, Valid values are: "major", "minor", "patch"`)
}
if (!['newest', 'separate'].includes(which)) {
	throw new Error(`Argument "which" has an unexpected value: ${which}, Valid values are: "newest", "separate"`)
}

const packageJsonPathsAbsolute = packageJsonPathsRelative.map((packageJsonPath) => path.join(executionPath, '..', packageJsonPath));
const packageJsonLockPathsAbsolute = packageJsonPathsAbsolute.map((packageJsonPath) => packageJsonPath.replace('.json', '-lock.json'));

// Load package.json files from disk and parse the json
const packageJsonContents = await Promise.all(packageJsonPathsAbsolute.map(async (path) => {
	return JSON.parse((await fs.readFile(path)).toString('utf8'));
}));
// Load package-lock.json files from disk and parse the json
const packageJsonLockContents = await Promise.all(packageJsonLockPathsAbsolute.map(async (path) => {
	return JSON.parse((await fs.readFile(path)).toString('utf8'));
}));

const versions = packageJsonContents.map((content) => content.version);

const parsedVersions = versions.map(parseVersion);

if (which === 'newest') {
	// Find the biggest version
	let biggestVersion = parsedVersions.at(0);
	parsedVersions.forEach(parsedVersion => {
		if (parsedVersion[0] > biggestVersion[0]) {
			biggestVersion = parsedVersion;
		}
		if (parsedVersion[1] > biggestVersion[1]) {
			biggestVersion = parsedVersion;
		}
		if (parsedVersion[2] > biggestVersion[2]) {
			biggestVersion = parsedVersion;
		}
	});

	const newVersionString = bumpParsedVersion(biggestVersion);

	// Update package.json versions with the new version
	packageJsonContents.forEach(content => {
		content.version = newVersionString
	});
	// Update package-lock.json versions with the new version
	packageJsonLockContents.forEach(content => {
		content.version = newVersionString;
		content.packages[''].version = newVersionString;
	});
} else if (which === 'separate') {
	// Update package.json versions with the new version
	packageJsonContents.forEach(content => {
		const parsedVersion = parseVersion(content.version);
		content.version = [parsedVersion[0] + 1, 0, 0];
	});

	// Update package-lock.json versions with the new version
	packageJsonLockContents.forEach(content => {
		const parsedVersion = parseVersion(content.version);
		const newVersionString = bumpParsedVersion(parsedVersion);

		content.version = newVersionString;
		content.packages[''].version = newVersionString;
	});
} else {
	throw new Error(`unknown "which" parameter: ${which}. Valid values are: "newest", "separate"`);
}

// Write package.json files back to disk
await Promise.all(packageJsonPathsAbsolute.map(async (path, index) => {
	return await fs.writeFile(path, JSON.stringify(packageJsonContents[index], null, 2));
}));
// Write package-lock.json files back to disk
await Promise.all(packageJsonLockPathsAbsolute.map(async (path, index) => {
	return await fs.writeFile(path, JSON.stringify(packageJsonLockContents[index], null, 2));
}));

console.log(`Versions of ${packageJsonContents.length + packageJsonLockContents.length} files were updated.`)
