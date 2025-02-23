import type { RichTextEditorControl } from '@meemoo/react-components';

export const RICH_TEXT_EDITOR_OPTIONS_ALIGN: RichTextEditorControl[] = [
	'separator',
	'text-align',
	'editHtml',
];

export const RICH_TEXT_EDITOR_OPTIONS_BASE: RichTextEditorControl[] = [
	'fullscreen',
	'separator',
	'undo',
	'redo',
	'separator',
	'headings',
	'separator',
	'bold',
	'italic',
	'strike-through',
	'underline',
	...RICH_TEXT_EDITOR_OPTIONS_ALIGN,
	'separator',
	'list-ul',
	'list-ol',
];

// LL & LK
export const RICH_TEXT_EDITOR_OPTIONS_DEFAULT: RichTextEditorControl[] = [
	...RICH_TEXT_EDITOR_OPTIONS_BASE,
	'separator',
	'remove-styles',
];

// Avo Eind redacteur, Educative Author & Partners
export const RICH_TEXT_EDITOR_OPTIONS_AUTHOR: RichTextEditorControl[] = [
	...RICH_TEXT_EDITOR_OPTIONS_BASE,
	'separator',
	'link',
	'separator',
	'remove-styles',
];

// Admin
export const RICH_TEXT_EDITOR_OPTIONS_FULL: RichTextEditorControl[] = [
	...RICH_TEXT_EDITOR_OPTIONS_BASE,
	'separator',
	'subscript',
	'superscript',
	'separator',
	'hr',
	'separator',
	'link',
	'separator',
	'table',
	'separator',
	'remove-styles',
	'editHtml',
];

export const RICH_TEXT_EDITOR_OPTIONS_FULL_WITHOUT_ALIGN: (
	| RichTextEditorControl[]
	| RichTextEditorControl
)[] = [
	'fullscreen',
	'separator',
	'undo',
	'redo',
	'separator',
	'headings',
	'separator',
	'bold',
	'italic',
	'strike-through',
	'underline',
	'separator',
	'list-ul',
	'list-ol',
	'separator',
	'subscript',
	'superscript',
	'separator',
	'hr',
	'separator',
	'link',
	'separator',
	'table',
	'separator',
	'remove-styles',
	'editHtml',
];

export const RICH_TEXT_EDITOR_OPTIONS_DEFAULT_NO_TITLES: (
	| RichTextEditorControl[]
	| RichTextEditorControl
)[] = [
	'undo',
	'redo',
	'separator',
	'bold',
	'italic',
	'strike-through',
	'underline',
	'separator',
	'list-ul',
	'list-ol',
	'separator',
	'subscript',
	'superscript',
	'separator',
	'hr',
	'separator',
	'remove-styles',
];

export const RICH_TEXT_EDITOR_OPTIONS_BUNDLE_DESCRIPTION: (
	| RichTextEditorControl[]
	| RichTextEditorControl
)[] = [
	'bold',
	'italic',
	'strike-through',
	'underline',
	'separator',
	'remove-styles',
	'separator',
	'link',
	'separator',
	'undo',
	'redo',
];
