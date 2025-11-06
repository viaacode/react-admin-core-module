import type { SelectOption } from '@viaa/avo2-components';
import { compact, debounce, get, isArray, isNil } from 'lodash-es';
import type { CSSProperties, ReactNode } from 'react';
import type { ColorSelectProps } from '~modules/content-page/components/fields/ColorSelect/ColorSelect.js';
import type { ContentPickerProps } from '~shared/components/ContentPicker/ContentPicker.js';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload.js';
import type { MaintainerSelectProps } from '~shared/components/MaintainerSelect/MaintainerSelect.js';
import type { RichTextEditorWithInternalStateWrapperProps } from '~shared/components/RichTextEditorWithInternalStateWrapper/RichTextEditorWithInternalStateWrapper.js';
import type { UploadOrSelectVideoStillProps } from '~shared/components/UploadOrSelectVideoStill/UploadOrSelectVideoStill.js';
import type { UserGroupSelectProps } from '~shared/components/UserGroupSelect/UserGroupSelect.js';
import type { ContentBlockField } from '../types/content-block.types.js';
import { ContentBlockEditor } from '../types/content-block.types.js';

interface DatePickerProps {
	children?: ReactNode;
	disabled?: boolean;
	required?: boolean;
	showTimeInput?: boolean;
	placeholder?: string;
	value?: Date | null;
	defaultTime?: string;
	onChange?: (date: Date | null) => void;
	minDate?: Date;
	maxDate?: Date;
	className?: string;
	style?: CSSProperties;
}

type RichTextEditorProps = Partial<RichTextEditorWithInternalStateWrapperProps>;

interface MultiRangeProps {
	onChange: (values: number[]) => void;
	values: number[];
}

interface CheckboxProps {
	onChange: (checked: boolean) => void;
	checked: boolean;
}

type FieldAttributes =
	| ContentPickerProps
	| DatePickerProps
	| RichTextEditorProps
	| ColorSelectProps
	| FileUploadProps
	| MultiRangeProps
	| CheckboxProps
	| UserGroupSelectProps
	| MaintainerSelectProps
	| UploadOrSelectVideoStillProps;

export const generateFieldAttributes = (
	field: ContentBlockField,
	// Optional key, so we can store rich text editor state side by side of the html string
	// biome-ignore lint/suspicious/noExplicitAny: todo
	onChange: (newValue: any, key?: string) => void,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	value: any,
	id: string,
	// key and state are required, so we can store rich text editor state side by side of the html string
	key: string,
	// biome-ignore lint/suspicious/noExplicitAny: todo
	state: any
): Partial<FieldAttributes> => {
	switch (field.editorType) {
		case ContentBlockEditor.TextInput:
			return {
				value,
				onChange: debounce(
					// biome-ignore lint/suspicious/noExplicitAny: todo
					(value: any) => {
						onChange(value);
					},
					150,
					{ leading: true }
				),
			};

		case ContentBlockEditor.ContentPicker:
			return {
				onChange,
				value,
			} as ContentPickerProps;

		case ContentBlockEditor.DatePicker:
			return {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange: (date: any) => onChange(date.toISOString()),
				value: value ? new Date(value) : null,
			} as DatePickerProps;

		case ContentBlockEditor.IconPicker:
		case ContentBlockEditor.ColorSelect:
			return {
				onChange: ((option: SelectOption<string>) => {
					onChange(get(option, 'value', ''));
					// biome-ignore lint/suspicious/noExplicitAny: todo investigate why this cast is needed
				}) as any,
				value: field.editorProps.options.find((opt: SelectOption<string>) => opt.value === value),
			};

		case ContentBlockEditor.RICH_TEXT_EDITOR: {
			// biome-ignore lint/suspicious/noExplicitAny: todo
			const html = (state as any)[key] || '';
			return {
				id,
				initialHtml: html, // Only use the html the first time, then use the editor state
				// biome-ignore lint/suspicious/noExplicitAny: todo
				value: (state as any)[key],
				onChange: (newValue: string) => {
					onChange(newValue, key);
				},
			} as Partial<RichTextEditorWithInternalStateWrapperProps>;
		}

		case ContentBlockEditor.FileUpload: {
			const urlOrUrls: string[] | undefined = value;
			return {
				// If the component wants a single value, take the first image from the array, otherwise pass the array
				onChange: (value: null | undefined | string[]) => {
					onChange(field.editorProps.allowMulti || !value ? value : value[0]);
				},
				urls: compact(Array.isArray(urlOrUrls) ? urlOrUrls : isNil(urlOrUrls) ? [] : [urlOrUrls]),
			};
		}

		case ContentBlockEditor.MultiRange:
			return {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange: (value: any) => {
					onChange(isArray(value) ? value[0] || 0 : value);
				},
				values: [value || 0], // TODO default to min value of input field instead of 0
			};

		case ContentBlockEditor.Checkbox:
			return {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange: (value: any) => onChange(value),
				checked: value,
			};

		case ContentBlockEditor.UserGroupSelect:
			return {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange: (value: any) => {
					onChange(value);
				},
				values: value,
			};

		case ContentBlockEditor.MaintainerSelect:
			return {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange: (newValue: any) => {
					onChange(newValue);
				},
				value,
				// Pass the item that was selected above the maintainer select to the maintainer select
				// So we can figure out which maintainers are used inside this content item
				contentItemType: state.mediaItem?.type || null,
				contentItemId: state.mediaItem?.value || null,
			};

		case ContentBlockEditor.UploadOrSelectVideoStill: {
			const item = state.item || state.mediaItem;
			return {
				// biome-ignore lint/suspicious/noExplicitAny: todo
				onChange: (value: any) => {
					onChange(value);
				},
				value,
				// Pass the item that was selected above the UploadOrSelectVideoStill input to the UploadOrSelectVideoStill input
				// So we can figure out which stills to show the user for this content item
				contentItemType: item?.type || null,
				contentItemId: item?.value || null,
			};
		}

		default:
			return {
				value,
				onChange,
			};
	}
};
