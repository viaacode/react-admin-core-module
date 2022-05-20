export type NavigationOverviewTableCols = 'placement' | 'description' | 'actions';

export interface NavigationEditParams {
	menu?: string;
	id?: string;
}

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
