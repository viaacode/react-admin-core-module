import type { RichTextEditorControl } from '@meemoo/react-components';
import { ROUTE_PARTS } from '~shared/consts/routes.js';

export const TRANSLATIONS_PATH = {
	TRANSLATIONS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
};

export const TRANSLATIONS_PER_PAGE = 20;

export const RICH_TEXT_EDITOR_OPTIONS: RichTextEditorControl[] = [
	'fullscreen',
	'separator',
	'undo',
	'redo',
	'separator',
	'headings',
	'separator',
	'bold',
	'underline',
	'italic',
	'separator',
	'link',
	'separator',
	'list-ul',
	'list-ol',
	'separator',
	'remove-styles',
	'editHtml',
];
