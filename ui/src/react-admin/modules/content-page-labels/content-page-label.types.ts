import type { AvoContentPageType } from '@viaa/avo2-types';
import type { Locale } from '~modules/translations/translations.core.types';
import type { FilterableTableState } from '~shared/components/FilterTable/FilterTable';
import type { PickerItem } from '~shared/types/content-picker';

export type ContentPageLabelOverviewTableCols =
	| 'label'
	| 'content_type'
	| 'link_to'
	| 'language'
	| 'created_at'
	| 'updated_at'
	| 'color'
	| 'actions';

export interface ContentPageLabel {
	id: number;
	label: string;
	content_type: AvoContentPageType;
	language: Locale;
	link_to: PickerItem | null;
	// The background colour of the generated visual label. Only exists on hetarchief
	color?: string;
	// Optional link to the dutch version of this label. Only exists on hetarchief (ARC-4200)
	// Used to translate the label filter in the url when the user switches the language of the website
	nl_parent_label_id?: string | null;
	nl_parent_label?: Pick<ContentPageLabel, 'id' | 'label' | 'language'> | null;
	// Only for dutch labels: the labels in other languages that link to this label
	translated_labels?: Pick<ContentPageLabel, 'id' | 'label' | 'language'>[];
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
	content_type: AvoContentPageType | null;
	language: Locale[];
	link_to: PickerItem | null;
	created_at: string;
	updated_at: string;
}
