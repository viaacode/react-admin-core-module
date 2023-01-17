import { NavigationItem } from '~modules/navigation/navigation.types';
import { TableColumn } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { ReactNode } from 'react';

export enum NAVIGATIONS_QUERY_KEYS {
	getNavigations = 'getNavigations',
	getNavigationItem = 'getNavigationItem',
}

export const GET_NAVIGATION_OVERVIEW_TABLE_COLS: () => TableColumn[] = () => [
	{
		id: 'placement',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/menu/menu___naam'),
	},
	{
		id: 'description',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/menu/menu___omschrijving'),
	},
	{
		id: 'actions',
		tooltip: AdminConfigManager.getConfig().services.i18n.tText('admin/menu/menu___acties'),
	},
];

export const INITIAL_NAVIGATION_FORM = (placement = ''): Partial<NavigationItem> => ({
	placement,
	description: '',
	icon_name: '',
	label: '',
	content_type: null,
	content_path: null,
	link_target: '_self',
	user_group_ids: [],
	tooltip: '',
});

export const GET_PAGE_TYPES_LANG = (): Record<string, ReactNode> => ({
	create: AdminConfigManager.getConfig().services.i18n.tText('admin/menu/menu___toevoegen'),
	edit: AdminConfigManager.getConfig().services.i18n.tText('admin/menu/menu___aanpassen'),
});
