export interface NavigationConfig {
	service?: {
		getAll: () => Promise<Navigation[]>;
		getByPlacement: (placement: string) => Promise<NavigationElement[]>;
		getById: (id: string) => Promise<NavigationElement>;
		updateById: (id: string) => Promise<NavigationElement>;
		insert: () => Promise<string>;
		delete: (id: string) => Promise<unknown>;
	};
	views: Record<string, any>;
}

export interface Navigation {
	description: string;
	id: string;
	placement: string;
	tooltip: string | null;
}

export interface NavigationElement {
	id: string;
	label: string | null;
	icon_name: string;
	description: string | null;
	user_group_ids: number[] | null;
	content_type: 'INTERNAL_LINK' | 'EXTERNAL_LINK' | string | null;
	content_path: string | number | null;
	link_target: '_blank' | '_self' | null;
	position: number;
	placement: string | null;
	created_at: string;
	updated_at: string;
	tooltip: string | null;
}

export interface NavigationOverviewCellProps {
	row: {
		original: Navigation;
	};
}

export interface NavigationElementParams {
	navigationName?: string;
	navigationElementId?: string;
}
