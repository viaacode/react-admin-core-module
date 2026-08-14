import { AvoCoreContentPickerType } from '@viaa/avo2-types';
import { describe, expect, it, vi } from 'vitest';
import type {
	ContentBlockField,
	ContentBlockFieldGroup,
} from '~modules/content-page/types/content-block.types';
import { Color } from '~modules/content-page/types/content-block.types';
import {
	DOUBLE_BANNER_BLOCK_CONFIG,
	INITIAL_DOUBLE_BANNER_COMPONENTS_STATE,
} from './BlockDoubleBanner.editorconfig';

vi.mock('~shared/helpers/translation-functions', () => ({
	tText: (key: string) => key,
}));

vi.mock('~shared/helpers/is-avo', () => ({
	isAvo: () => false,
}));

vi.mock('~shared/consts/icons.consts', () => ({
	GET_ADMIN_ICON_OPTIONS: () => [{ label: 'Newspaper', value: 'newspaper' }],
}));

const config = DOUBLE_BANNER_BLOCK_CONFIG();
const halvesField = config.components.fields.halves as ContentBlockFieldGroup;
const fields = halvesField.fields;
const field = (key: string): ContentBlockField => fields[key];

describe('DOUBLE_BANNER_BLOCK_CONFIG', () => {
	it('always starts with exactly two halves', () => {
		const state = INITIAL_DOUBLE_BANNER_COMPONENTS_STATE();

		expect(state.halves).toHaveLength(2);
		expect(halvesField.min).toBe(2);
		expect(halvesField.max).toBe(2);
	});

	it('keeps only the three icon fields optional', () => {
		for (const key of ['label', 'link', 'image', 'textColor', 'backgroundColor']) {
			expect(field(key).validator?.('')).not.toEqual([]);
			expect(field(key).validator?.('#000')).toEqual([]);
		}

		for (const key of ['icon1', 'icon2', 'icon3']) {
			expect(field(key).validator).toBeUndefined();
			expect(field(key).editorProps.options).toEqual([{ label: 'Newspaper', value: 'newspaper' }]);
		}
	});

	it('does not impose a maximum label length', () => {
		expect(field('label').editorProps?.maxLength).toBeUndefined();
	});

	it('accepts one image per half', () => {
		expect(field('image').editorProps).toMatchObject({
			assetType: 'CONTENT_BLOCK_IMAGE',
			allowMulti: false,
		});
	});

	it('accepts URLs and internal destinations in the same tab', () => {
		expect(field('link').editorProps).toMatchObject({
			hideTargetSwitch: true,
			allowedTypes: [
				AvoCoreContentPickerType.CONTENT_PAGE,
				AvoCoreContentPickerType.INTERNAL_LINK,
				AvoCoreContentPickerType.EXTERNAL_LINK,
				AvoCoreContentPickerType.ANCHOR_LINK,
			],
		});
	});

	it('defaults to white text on a black background', () => {
		const state = INITIAL_DOUBLE_BANNER_COMPONENTS_STATE();

		expect(state.halves[0]).toMatchObject({
			textColor: Color.White,
			backgroundColor: Color.Black,
		});
		expect(field('textColor').editorProps.defaultValue?.value).toBe(Color.White);
		expect(field('backgroundColor').editorProps.defaultValue?.value).toBe(Color.Black);
	});
});
