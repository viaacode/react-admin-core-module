import { describe, expect, it, vi } from 'vitest';
import { PLAYABLE_DISPLAY_DATA_BLOCKS } from '~modules/content-page/components/ContentBlockRenderer/ContentBlockRenderer.const';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';

vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
}));

vi.mock('~shared/helpers/is-avo', () => ({
	isAvo: () => false,
}));

/**
 * The modal's own rendering needs a DOM harness this package does not set up for blocks, so these
 * cover the wiring that decides whether it can work at all: the block type has to match the db
 * lookup value, and the renderer has to hand the block its id.
 */
describe('Driekeuzespeler modal wiring', () => {
	it('uses the block type value the database lookup already holds', () => {
		// The lookup value predates this work: migration 1784294418766 inserted THREE_CHOICES_PLAYER.
		// A mismatch here makes every save fail on a foreign key, which is easy to miss locally.
		expect(ContentBlockType.ThreeChoicesPlayer).toBe('THREE_CHOICES_PLAYER');
	});

	it('is listed as a block that receives its blockId', () => {
		// Without this the block gets no id, so the modal would fall back to the unsaved-objects path
		// and resolve nothing for an ordinary visitor.
		expect(PLAYABLE_DISPLAY_DATA_BLOCKS).toContain(ContentBlockType.ThreeChoicesPlayer);
	});
});
