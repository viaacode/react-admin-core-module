import type { NavigationItem } from '~modules/navigation/navigation.types';
import type { TableColumn } from '@viaa/avo2-components';
import type { ReactNode } from 'react';
import { tText } from '~shared/helpers/translation-functions';

export const GET_NAVIGATION_OVERVIEW_TABLE_COLS: () => TableColumn[] = () => [
	{
		id: 'placement',
		label: tText('admin/menu/menu___naam'),
	},
	{
		id: 'description',
		label: tText('admin/menu/menu___omschrijving'),
	},
	{
		id: 'actions',
		tooltip: tText('admin/menu/menu___acties'),
	},
];

export const INITIAL_NAVIGATION_FORM = (placement = ''): Partial<NavigationItem> => ({
	placement,
	description: '',
	iconName: '',
	label: '',
	contentType: null,
	contentPath: null,
	linkTarget: '_self',
	userGroupIds: [],
	tooltip: '',
	position: 0,
});

export const GET_PAGE_TYPES_LANG = (): Record<string, ReactNode> => ({
	create: tText('admin/menu/menu___toevoegen'),
	edit: tText('admin/menu/menu___aanpassen'),
});
