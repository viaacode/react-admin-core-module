import type { Avo } from '@viaa/avo2-types';
import type { Locale } from '~modules/translations/translations.core.types';
import type { FilterableTableState } from '~shared/components/FilterTable/FilterTable';
import type { LinkTarget } from '~shared/components/SmartLink/SmartLink.types';

export type NavigationOverviewTableCols = 'placement' | 'description' | 'actions';

export enum NavigationEditPageType {
	edit = 'edit',
	create = 'create',
}

export interface NavigationEditFormErrorState {
	description?: string;
	placement?: string;
	icon?: string;
	label?: string;
	contentPath?: string;
	contentType?: string;
	linkTarget?: string;
	userGroupIds?: string;
	language?: string;
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
	linkTarget: LinkTarget | null;
	position: number;
	language: Locale;
	createdAt: string;
	updatedAt: string;
}

export type NavigationItemUpdate = Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>;

export interface NavigationItemsTableState extends FilterableTableState {
	label: string;
	language: Locale[];
}

export type NavigationItemOverviewTableCols = 'sort' | 'label' | 'language' | 'actions';
