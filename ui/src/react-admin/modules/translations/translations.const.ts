import { RichTextEditorControl } from '@meemoo/react-components';
import { NumberParam, StringParam, withDefault } from 'use-query-params';
import { ROUTE_PARTS } from '~shared/consts/routes';
import { SortDirectionParam } from '~shared/helpers/query-params';

export const TRANSLATIONS_PATH = {
	TRANSLATIONS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.translations}`,
};

export interface TranslationsOverviewRef {
	onSave: () => void;
}

export const TRANSLATIONS_QUERY_PARAM_CONFIG = {
	search: withDefault(StringParam, ''),
	page: withDefault(NumberParam, 1),
	orderProp: withDefault(StringParam, 'key'),
	orderDirection: withDefault(SortDirectionParam, 'asc'),
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
