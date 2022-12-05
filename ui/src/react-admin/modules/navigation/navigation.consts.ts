import { NavigationItem } from '~modules/navigation/navigation.types';

export enum NAVIGATIONS_QUERY_KEYS {
	getNavigations = 'getNavigations',
	getNavigationItem = 'getNavigationItem',
}

import { TableColumn } from '@viaa/avo2-components';
import { AdminConfigManager } from '~core/config';
import { ReactNode } from 'react';

export const NAVIGATION_PATH = () => {
	const ROUTE_PARTS = AdminConfigManager.getConfig().route_parts;

	return {
		NAVIGATION_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}`,
		NAVIGATION_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/${ROUTE_PARTS.create}`,
		NAVIGATION_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId`,
		NAVIGATION_ITEM_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId/${ROUTE_PARTS.create}`,
		NAVIGATION_ITEM_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.navigation}/:navigationBarId/:navigationItemId/${ROUTE_PARTS.edit}`,
	};
};

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
