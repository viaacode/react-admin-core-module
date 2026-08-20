import type { SelectOption } from '@viaa/avo2-components';
import { describe, expect, it, vi } from 'vitest';
import { Color, ContentBlockEditor } from '~modules/content-page/types/content-block.types';
import { generateFieldAttributes } from './field-attributes';

interface ColorSelectAttributes {
	defaultValue?: SelectOption<string>;
	onChange?: (option: SelectOption<string>) => void;
}

describe('generateFieldAttributes', () => {
	it('maps a Color enum default to the option expected by ColorSelect', () => {
		const whiteOption: SelectOption<string> = {
			label: 'White',
			value: Color.White,
		};
		const onChange = vi.fn();
		const attributes = generateFieldAttributes(
			{
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: [whiteOption],
					defaultValue: Color.White,
				},
			},
			onChange,
			undefined,
			'color',
			'color',
			{}
		) as ColorSelectAttributes;

		expect(attributes.defaultValue).toBe(whiteOption);
		attributes.onChange?.(whiteOption);
		expect(onChange).toHaveBeenCalledWith(Color.White);
	});

	it('keeps existing option-object defaults compatible', () => {
		const blackOption: SelectOption<string> = {
			label: 'Black',
			value: Color.Black,
		};
		const attributes = generateFieldAttributes(
			{
				editorType: ContentBlockEditor.ColorSelect,
				editorProps: {
					options: [blackOption],
					defaultValue: blackOption,
				},
			},
			vi.fn(),
			undefined,
			'color',
			'color',
			{}
		) as ColorSelectAttributes;

		expect(attributes.defaultValue).toBe(blackOption);
	});
});
