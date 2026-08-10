import { describe, expect, it, vi } from 'vitest';

vi.mock('~shared/helpers/is-avo', () => ({ isAvo: () => false }));
vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

import { Color } from '../../types/content-block.types';
import { BACKGROUND_COLOR_FIELD, FOREGROUND_COLOR_FIELD } from './defaults';

describe('colour field helpers', () => {
	it('BACKGROUND_COLOR_FIELD honours an explicit defaultValue', () => {
		const field = BACKGROUND_COLOR_FIELD('Kleur kader', {
			label: 'Zwart',
			value: Color.Black,
		});

		expect(field.editorProps.defaultValue.value).toEqual(Color.Black);
	});

	it('FOREGROUND_COLOR_FIELD honours an explicit defaultValue', () => {
		const field = FOREGROUND_COLOR_FIELD('Tekstkleur', {
			label: 'Wit',
			value: Color.White,
		});

		expect(field.editorProps.defaultValue.value).toEqual(Color.White);
	});
});
