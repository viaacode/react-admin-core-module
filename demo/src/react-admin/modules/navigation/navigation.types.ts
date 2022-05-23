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

export interface NavigationItem {
	id: string;
	label: string | null;
	icon_name: string;
	description: string | null;
	user_group_ids: string[] | null;
	content_type: ContentPickerTypeSchema | null;
	content_path: string | number | null;
	link_target: '_blank' | '_self' | null;
	position: number;
	placement: string | null;
	created_at: string;
	updated_at: string;
	tooltip: string | null;
}
