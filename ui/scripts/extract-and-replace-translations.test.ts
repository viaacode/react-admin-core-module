import { Project, SyntaxKind } from 'ts-morph';
import { describe, expect, it } from 'vitest';
import {
	ensureVariablesInValue,
	extractInterpolationVariables,
	usesAnyVariable,
} from './extract-and-replace-translations';

/** Returns the variables that would be extracted from the second parameter of the given call. */
function variablesOf(call: string): string[] {
	const sourceFile = new Project({ useInMemoryFileSystem: true }).createSourceFile(
		'test.ts',
		`const value = ${call};`
	);
	const callExpression = sourceFile.getFirstDescendantByKindOrThrow(SyntaxKind.CallExpression);
	const argument = callExpression.getArguments()[1];
	return extractInterpolationVariables(argument);
}

describe('extractInterpolationVariables', () => {
	it('returns the keys of an object literal', () => {
		expect(variablesOf("tText('...', { userName: user.name, count: items.length })")).toEqual([
			'userName',
			'count',
		]);
	});

	it('returns the keys of shorthand and quoted properties', () => {
		expect(variablesOf("tText('...', { userName, 'count': 1 })")).toEqual(['userName', 'count']);
	});

	it('ignores nested object keys and type annotations', () => {
		expect(variablesOf("tText('...', { userName: { first: a, last: b } })")).toEqual(['userName']);
	});

	it('ignores spread properties, which have no usable name', () => {
		expect(variablesOf("tText('...', { ...defaults, userName: user.name })")).toEqual(['userName']);
	});

	it('returns nothing when the second parameter is not an object literal', () => {
		expect(variablesOf("tText('...', interpolationParams)")).toEqual([]);
	});

	it('returns nothing when there is no second parameter', () => {
		expect(variablesOf("tText('...')")).toEqual([]);
	});
});

describe('ensureVariablesInValue', () => {
	it('restores a placeholder that was flattened into words by the key', () => {
		expect(
			ensureVariablesInValue('Preview als selected user group', ['selectedUserGroup'])
		).toEqual({
			value: 'Preview als {{selectedUserGroup}}',
			missing: [],
		});
	});

	it('restores a placeholder in the middle of a sentence', () => {
		expect(
			ensureVariablesInValue('Je hebt num of selected profiles gebruikers geselecteerd.', [
				'numOfSelectedProfiles',
			])
		).toEqual({
			value: 'Je hebt {{numOfSelectedProfiles}} gebruikers geselecteerd.',
			missing: [],
		});
	});

	it('keeps punctuation that is glued to the flattened placeholder', () => {
		expect(
			ensureVariablesInValue('Er werden geen navigatie items gevonden voor menu name.', [
				'menuName',
			])
		).toEqual({
			value: 'Er werden geen navigatie items gevonden voor {{menuName}}.',
			missing: [],
		});
	});

	it('restores every occurrence of a variable that is used more than once', () => {
		expect(
			ensureVariablesInValue(
				'Je hebt al een idp type account, ontkoppel eerst je idp type account',
				['idpType']
			)
		).toEqual({
			value: 'Je hebt al een {{idpType}} account, ontkoppel eerst je {{idpType}} account',
			missing: [],
		});
	});

	it('leaves an intact value untouched', () => {
		const value =
			'<p>Valt onder auteursrechten van <a href="{{organisationWebsite}}">{{name}}</a></p>';
		expect(ensureVariablesInValue(value, ['organisationWebsite', 'name'])).toEqual({
			value,
			missing: [],
		});
	});

	it('reports a value it cannot repair instead of mangling it', () => {
		expect(
			ensureVariablesInValue('Preview als geselecteerde gebruikersgroep', ['selectedUserGroup'])
		).toEqual({
			value: 'Preview als geselecteerde gebruikersgroep',
			missing: ['selectedUserGroup'],
		});
	});

	it('does not let a variable swallow more words than it was flattened into', () => {
		// 'group' is a single word, so it may not consume 'user group'
		expect(ensureVariablesInValue('Preview als user group', ['group'])).toEqual({
			value: 'Preview als user {{group}}',
			missing: [],
		});
	});

	it('returns the value unchanged when there are no variables', () => {
		expect(ensureVariablesInValue('Verplaats naar boven', [])).toEqual({
			value: 'Verplaats naar boven',
			missing: [],
		});
	});
});

describe('usesAnyVariable', () => {
	it('accepts a value that uses every variable', () => {
		expect(usesAnyVariable([], ['userName', 'count'])).toBe(true);
	});

	it('accepts a value that uses only some of its variables, since they can be optional', () => {
		expect(usesAnyVariable(['count'], ['userName', 'count'])).toBe(true);
	});

	it('rejects a value that uses none of its variables', () => {
		expect(usesAnyVariable(['userName', 'count'], ['userName', 'count'])).toBe(false);
	});

	it('rejects a value that lost its only variable', () => {
		expect(usesAnyVariable(['userName'], ['userName'])).toBe(false);
	});
});
