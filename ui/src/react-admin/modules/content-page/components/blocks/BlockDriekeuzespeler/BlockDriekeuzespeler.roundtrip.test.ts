import { describe, expect, it, vi } from 'vitest';
import { CONTENT_BLOCK_CONFIG_MAP } from '~modules/content-page/const/content-block-config-map';
import { CONTENT_BLOCK_INITIAL_STATE_MAP } from '~modules/content-page/const/content-block-initial-state-map';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import { REPEATABLE_CONTENT_BLOCKS } from '../../ContentBlockRenderer/ContentBlockRenderer.const';
import { INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE } from './BlockDriekeuzespeler.editorconfig';

vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
}));

vi.mock('~shared/helpers/is-avo', () => ({
	isAvo: () => false,
}));

/**
 * A content page stores `components.state` as JSON and reads it back on the next page load. These
 * tests cover the ways that round trip can silently lose the block's nested arrays. They are not a
 * substitute for opening the editor once against a real database, but they pin the parts that a
 * database cannot fix if they are wrong.
 */
describe('Driekeuzespeler state round trip', () => {
	it('keeps a filled-in state intact, nested arrays included', () => {
		const saved = {
			title: 'Waar wil je in duiken?',
			shuffleButtonLabel: 'Toon me iets anders',
			tileColors: [
				{ backgroundColor: '#EFCA6A', textColor: '#000' },
				{ backgroundColor: '#BDDEE7', textColor: '#000' },
				{ backgroundColor: '#9B6072', textColor: '#FFF' },
			],
			interests: [
				{
					name: 'Wielrennen',
					mediaItem: { type: 'IE_OBJECT', value: 'abc123' },
					themeId: 'theme-1',
				},
				{ name: 'Kermis', mediaItem: { type: 'IE_OBJECT', value: 'def456' }, themeId: 'theme-2' },
				{ name: 'Stoeten', mediaItem: { type: 'IE_OBJECT', value: 'ghi789' }, themeId: 'theme-3' },
			],
		};

		const reloaded = JSON.parse(JSON.stringify(saved));

		expect(reloaded).toEqual(saved);
		expect(reloaded.tileColors).toHaveLength(3);
		expect(reloaded.interests).toHaveLength(3);
	});

	it('is registered in the config and initial-state maps, so a saved block can be reopened', () => {
		expect(CONTENT_BLOCK_CONFIG_MAP[ContentBlockType.Driekeuzespeler]).toBeDefined();
		expect(CONTENT_BLOCK_INITIAL_STATE_MAP[ContentBlockType.Driekeuzespeler]).toBeDefined();
	});

	it('stays out of REPEATABLE_CONTENT_BLOCKS, so its state is read as an object', () => {
		// A block in that list has its whole `components.state` treated as an array and handed to the
		// preview as an `elements` prop. This block uses mechanism B, so being listed there would
		// silently blank every field.
		expect(REPEATABLE_CONTENT_BLOCKS).not.toContain(ContentBlockType.Driekeuzespeler);
	});

	it('starts from an object, not an array, which is what mechanism B requires', () => {
		const config = CONTENT_BLOCK_CONFIG_MAP[ContentBlockType.Driekeuzespeler]();

		expect(Array.isArray(config.components.state)).toBe(false);
	});

	it('names its state keys exactly as the preview component reads them', () => {
		// The renderer spreads `components.state` straight into the component's props, so a renamed
		// key arrives as undefined instead of failing loudly.
		expect(Object.keys(INITIAL_DRIEKEUZESPELER_COMPONENTS_STATE()).sort()).toEqual([
			'interests',
			'shuffleButtonLabel',
			'tileColors',
			'title',
		]);
	});

	it('declares a field for every key in its state, and no key without a field', () => {
		const config = CONTENT_BLOCK_CONFIG_MAP[ContentBlockType.Driekeuzespeler]();

		expect(Object.keys(config.components.fields).sort()).toEqual(
			Object.keys(config.components.state).sort()
		);
	});
});
