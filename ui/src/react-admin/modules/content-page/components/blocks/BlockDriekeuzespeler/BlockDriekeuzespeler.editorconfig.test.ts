import { beforeEach, describe, expect, it, vi } from 'vitest';
import type {
	ContentBlockConfig,
	ContentBlockField,
	ContentBlockFieldGroup,
	DriekeuzespelerBlockComponentState,
} from '~modules/content-page/types/content-block.types';
import { Color, ContentBlockEditor } from '~modules/content-page/types/content-block.types';
import {
	DRIEKEUZESPELER_CONFIG,
	DRIEKEUZESPELER_MAX_INTERESTS,
	DRIEKEUZESPELER_MIN_INTERESTS,
	DRIEKEUZESPELER_TILE_COUNT,
	INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE,
} from './BlockDriekeuzespeler.editorconfig';

vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
}));

vi.mock('~shared/helpers/is-avo', () => ({
	isAvo: () => false,
}));

// Rebuilt per test, so nothing one test does to the config leaks into the next.
let config: ContentBlockConfig;

beforeEach(() => {
	config = DRIEKEUZESPELER_CONFIG();
});

const group = (key: string): ContentBlockFieldGroup =>
	config.components.fields[key] as ContentBlockFieldGroup;
const field = (key: string): ContentBlockField =>
	config.components.fields[key] as ContentBlockField;

describe('DRIEKEUZESPELER_CONFIG', () => {
	it('starts with one colour entry per tile and the minimum number of interests', () => {
		const state = INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE();

		expect(state.tileColors).toHaveLength(DRIEKEUZESPELER_TILE_COUNT);
		expect(state.interests).toHaveLength(DRIEKEUZESPELER_MIN_INTERESTS);
	});

	it('defaults every tile to no background and black text, as the FA asks', () => {
		const state = INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE();

		for (const entry of state.tileColors) {
			expect(entry).toEqual({
				backgroundColor: Color.Transparent,
				textColor: Color.Black,
			});
		}
	});

	it('renders the fields in the order the FA lists them', () => {
		// Object.keys order is the render order in ContentBlockFormGroup, so it is a real UI contract.
		expect(Object.keys(config.components.fields)).toEqual([
			'title',
			'tileColors',
			'shuffleButtonLabel',
			'interests',
		]);
	});

	it('gives every initial interest empty required fields', () => {
		const state = INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE();

		for (const interest of state.interests) {
			expect(interest).toEqual({ name: '', mediaItem: undefined, theme: undefined });
		}
	});

	it('holds the interests between 3 and 200', () => {
		expect(group('interests').min).toBe(DRIEKEUZESPELER_MIN_INTERESTS);
		expect(group('interests').max).toBe(DRIEKEUZESPELER_MAX_INTERESTS);
		expect(DRIEKEUZESPELER_MAX_INTERESTS).toBe(200);
	});

	it('fixes the colour list at three, so the count cannot change', () => {
		expect(group('tileColors').min).toBe(DRIEKEUZESPELER_TILE_COUNT);
		expect(group('tileColors').max).toBe(DRIEKEUZESPELER_TILE_COUNT);
	});

	it('holds both colours of a tile in the same entry', () => {
		// One group per tile, so the admin fills a tile in completely instead of jumping between lists.
		expect(Object.keys(group('tileColors').fields ?? {})).toEqual(['backgroundColor', 'textColor']);
	});

	it('marks both repeated sets as field groups, so FieldGenerator iterates them', () => {
		// A group without `type: 'fieldGroup'` falls through to the single-field branch, and one
		// without `repeat` renders once instead of per entry.
		for (const key of ['tileColors', 'interests']) {
			expect(group(key).type).toBe('fieldGroup');
			expect(group(key).repeat).toBeDefined();
		}
	});

	it('requires a title and a shuffle label', () => {
		expect(field('title').validator?.('')).toEqual(expect.arrayContaining([expect.any(String)]));
		expect(field('shuffleButtonLabel').validator?.('')).toEqual(
			expect.arrayContaining([expect.any(String)])
		);
		expect(field('title').validator?.('Ontdek')).toEqual([]);
	});

	it('requires a name and an object on every interest', () => {
		const interestFields = group('interests').fields;

		// A plain ContentPicker field like every other block's, so it carries no validator of its own.
		const filledValues: Record<string, unknown> = {
			name: 'Wielrennen',
			mediaItem: { type: 'IE_OBJECT', value: '086348mc8s' },
		};

		for (const [key, filled] of Object.entries(filledValues)) {
			expect(interestFields[key].validator?.('')).toEqual(
				expect.arrayContaining([expect.any(String)])
			);
			expect(interestFields[key].validator?.(filled)).toEqual([]);
		}
	});

	it('picks the object with the shared object picker, so nobody types a pid by hand', () => {
		// The `mediaItem` key is shared by every block pointing at an ie-object, and read by the proxy.
		const mediaItem = group('interests').fields.mediaItem;

		expect(mediaItem.editorType).toBe(ContentBlockEditor.ContentPicker);
		expect(mediaItem.editorProps).toMatchObject({
			allowedTypes: ['IE_OBJECT'],
			hideTypeDropdown: true,
		});
	});

	it('picks the theme with the shared content picker, so an interest links to exactly one theme', () => {
		// The same picker BlockThemeReels and BlockOverviewThemes use, locked to themes.
		const theme = group('interests').fields.theme;

		expect(theme.editorType).toBe(ContentBlockEditor.ContentPicker);
		expect(theme.editorProps).toMatchObject({
			allowedTypes: ['IE_OBJECT_THEME'],
			hideTypeDropdown: true,
			hideTargetSwitch: true,
		});
	});

	it('types its own initial state', () => {
		// Compile-time check that the state the editor stores matches the state the block renders.
		const state: DriekeuzespelerBlockComponentState =
			INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE() as DriekeuzespelerBlockComponentState;

		expect(state.title).toBe('');
		expect(state.shuffleButtonLabel).toBe('');
	});
});
