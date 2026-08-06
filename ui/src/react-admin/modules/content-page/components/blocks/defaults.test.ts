import { describe, expect, it, vi } from 'vitest';

vi.mock('~shared/helpers/is-avo', () => ({ isAvo: () => false }));
vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
	tHtml: (key: string) => key,
}));

import { Color, CustomBackground, GradientColor } from '../../types/content-block.types';
import { BACKGROUND_COLOR_FIELD, FOREGROUND_COLOR_FIELD, SOLID_COLOR_FIELD } from './defaults';

describe('SOLID_COLOR_FIELD', () => {
	it('drops the options that are not a plain CSS colour', () => {
		const values = SOLID_COLOR_FIELD('Kleur kader').editorProps.options.map(
			(option: { value: string }) => option.value
		);

		expect(values).not.toContain(Color.Transparent);
		expect(values).not.toContain(CustomBackground.MeemooLogo);
		expect(values).not.toContain(GradientColor.BlackWhite);
	});

	it('keeps the plain colours, including the tertiary ones', () => {
		const values = SOLID_COLOR_FIELD('Tekstkleur').editorProps.options.map(
			(option: { value: string }) => option.value
		);

		expect(values).toContain(Color.White);
		expect(values).toContain(Color.Black);
		expect(values).toContain(Color.Mustard);
	});
});

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
