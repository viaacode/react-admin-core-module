import { beforeAll, describe, expect, it } from 'vitest';
import { AdminConfigManager } from '~core/config/config.class';
import { ContentBlockType } from '~modules/content-page/types/content-block.types';
import { convertDbContentBlockToContentBlockConfig } from './content-page.converters';

beforeAll(() => {
	AdminConfigManager.setConfig({
		services: {
			i18n: {
				tText: (key: string) => key,
				tHtml: (key: string) => key,
			},
			// biome-ignore lint/suspicious/noExplicitAny: minimal stub for test
			toastService: { showToast: () => {}, hideToast: () => {} } as any,
		},
		components: {
			buttonTypes: () => [],
		},
		env: {
			DATABASE_APPLICATION_TYPE: 'avo',
		},
		// biome-ignore lint/suspicious/noExplicitAny: minimal stub for test
	} as any);
});

describe('A->B lazy migration in converter', () => {
	it('wraps a legacy-array Buttons block (migrated to B) under `elements`', () => {
		const legacyButtons = [
			{ label: 'One', type: 'primary' },
			{ label: 'Two', type: 'secondary' },
		];
		const [config] = convertDbContentBlockToContentBlockConfig([
			{
				type: ContentBlockType.Buttons,
				name: 'Knoppen',
				position: 0,
				// biome-ignore lint/suspicious/noExplicitAny: test fixture
				components: legacyButtons as any,
				// biome-ignore lint/suspicious/noExplicitAny: test fixture
				block: {} as any,
			},
		]);

		const state = config.components.state as { elements: unknown[] };
		expect(Array.isArray(config.components.state)).toBe(false);
		expect(state.elements).toEqual(legacyButtons);
	});

	it('leaves a still-array block (CTAs, not yet migrated) as an array', () => {
		const legacyCtas = [{ heading: 'A' }, { heading: 'B' }];
		const [config] = convertDbContentBlockToContentBlockConfig([
			{
				type: ContentBlockType.CTAs,
				name: 'CTAs',
				position: 0,
				// biome-ignore lint/suspicious/noExplicitAny: test fixture
				components: legacyCtas as any,
				// biome-ignore lint/suspicious/noExplicitAny: test fixture
				block: {} as any,
			},
		]);

		expect(Array.isArray(config.components.state)).toBe(true);
		expect(config.components.state).toHaveLength(2);
	});

	it('merges an already-B Buttons object onto defaults (idempotent re-save)', () => {
		const migrated = { elements: [{ label: 'One', type: 'primary' }] };
		const [config] = convertDbContentBlockToContentBlockConfig([
			{
				type: ContentBlockType.Buttons,
				name: 'Knoppen',
				position: 0,
				// biome-ignore lint/suspicious/noExplicitAny: test fixture
				components: migrated as any,
				// biome-ignore lint/suspicious/noExplicitAny: test fixture
				block: {} as any,
			},
		]);

		const state = config.components.state as { elements: unknown[] };
		expect(state.elements).toEqual(migrated.elements);
	});
});
