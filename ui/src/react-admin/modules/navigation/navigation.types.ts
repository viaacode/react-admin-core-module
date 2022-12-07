import { ContentPickerTypeSchema } from '@viaa/avo2-types/types/core';

export type NavigationOverviewTableCols = 'placement' | 'description' | 'actions';

export type NavigationEditPageType = 'edit' | 'create';

export interface NavigationEditFormErrorState {
	description?: string;
	placement?: string;
	icon?: string;
	label?: string;
	content_path?: string;
	content_type?: string;
	link_target?: string;
	user_group_ids?: string;
	tooltip?: string;
}

export interface NavigationBar {
	id: string;
	description: string | null;
	placement: string | null;
	tooltip: string | null;
}

// NavigationItem extends from NavigationBar because we opted to only use one table to save both entities
// Might be cleaner to split into 2 tables in the future
export interface NavigationItem extends NavigationBar {
	label: string | null;
	icon_name: string;
	user_group_ids: string[] | null;
	content_type: ContentPickerTypeSchema | null;
	content_path: string | null;
	link_target: '_blank' | '_self' | null;
	position: number;
	created_at: string;
	updated_at: string;
}
