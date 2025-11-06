import type { Avo } from '@viaa/avo2-types';
import type { Locale } from '~modules/translations/translations.core.types.js';

import type { FilterableTableState } from '~shared/components/FilterTable/FilterTable.js';
import type { PickerItem } from '~shared/types/content-picker.js';

export type ContentPageLabelOverviewTableCols =
	| 'label'
	| 'content_type'
	| 'link_to'
	| 'language'
	| 'created_at'
	| 'updated_at'
	| 'actions';

export interface ContentPageLabel {
	id: number;
	label: string;
	content_type: Avo.ContentPage.Type;
	language: Locale;
	link_to: PickerItem | null;
	created_at: string;
	updated_at: string;
}

export interface ContentPageLabelEditFormErrorState {
	label?: string;
	content_type?: string;
	language?: string;
	link_to?: string;
}

export interface ContentPageLabelTableState extends FilterableTableState {
	label: string;
	content_type: Avo.ContentPage.Type | null;
	language: Locale[];
	link_to: PickerItem | null;
	created_at: string;
	updated_at: string;
}
