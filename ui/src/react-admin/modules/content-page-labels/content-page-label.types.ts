import type { Avo } from '@viaa/avo2-types';
import { LanguageCode } from '~modules/translations/translations.core.types';

import { FilterableTableState } from '~shared/components/FilterTable/FilterTable';
import { PickerItem } from '~shared/types/content-picker';

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
	language: LanguageCode;
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
	language: LanguageCode[];
	link_to: PickerItem | null;
	created_at: string;
	updated_at: string;
}
