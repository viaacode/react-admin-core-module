import type { SelectOption } from '@viaa/avo2-components';
import { describe, expect, it, vi } from 'vitest';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import type { ContentBlockField } from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
import { HET_ARCHIEF_QUOTE_BLOCK_CONFIG } from './BlockHetArchiefQuote.editorconfig';

vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
}));

vi.mock('~shared/helpers/is-avo', () => ({
	isAvo: () => false,
}));

const config = HET_ARCHIEF_QUOTE_BLOCK_CONFIG();
const field = (key: string): ContentBlockField =>
	config.components.fields[key] as ContentBlockField;
const optionValues = (key: string): string[] =>
	(field(key).editorProps?.options as SelectOption<string>[]).map((option) => option.value);

describe('HET_ARCHIEF_QUOTE_BLOCK_CONFIG', () => {
	it('offers the background palette on both colour fields, as the FA asks', () => {
		const backgroundValues = GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF().map((option) => option.value);

		expect(optionValues('textColor')).toEqual(backgroundValues);
		expect(optionValues('frameColor')).toEqual(backgroundValues);
	});

	it('defaults to white text on a black frame', () => {
		expect(field('textColor').editorProps?.defaultValue).toBe(Color.White);
		expect(field('frameColor').editorProps?.defaultValue).toBe(Color.Black);
	});
});
