import { Avo } from '@viaa/avo2-types';

export type NavigationOverviewTableCols = 'placement' | 'description' | 'actions';

export type NavigationEditPageType = 'edit' | 'create';

export interface NavigationEditFormErrorState {
	description?: string;
	placement?: string;
	icon?: string;
	label?: string;
	contentPath?: string;
	contentType?: string;
	linkTarget?: string;
	userGroupIds?: string;
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
	iconName: string;
	label: string | null;
	userGroupIds: string[] | null;
	contentType: Avo.Core.ContentPickerType | null;
	contentPath: string | null;
	linkTarget: '_blank' | '_self' | null;
	position: number;
	createdAt: string;
	updatedAt: string;
}

export type NavigationItemUpdate = Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>;
