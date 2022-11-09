import { TabProps } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';

import { FilterableColumn } from '../../shared/components/FilterTable/FilterTable';
import { ROUTE_PARTS } from '../../shared/consts/routes';
import { NULL_FILTER } from '../../shared/helpers/filters';
import { ContentOverviewTableCols, ContentWidth } from '../types/content-pages.types';

import { AdminConfigManager } from '~core/config';
import {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';
import { AvoOrHetArchief } from '~modules/shared/types';

export const GET_OVERVIEW_COLUMNS: (
	contentTypeOptions: CheckboxOption[],
	userGroupOptions: CheckboxOption[],
	contentPageLabelOptions: CheckboxOption[]
) => FilterableColumn[] = (contentTypeOptions, userGroupOptions, contentPageLabelOptions) => {
	const i18n = AdminConfigManager.getConfig().services.i18n;
	return [
		{
			id: 'title',
			label: i18n.tText('admin/content/content___titel'),
			sortable: true,
			visibleByDefault: true,
			dataType: 'string',
		},
		{
			id: 'content_type',
			label: i18n.tText('admin/content/content___content-type'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'CheckboxDropdownModal',
			filterProps: {
				options: contentTypeOptions,
			} as CheckboxDropdownModalProps,
			dataType: 'string',
		},
		{
			id: 'user_profile_id',
			label: i18n.tText('admin/content/content___auteur'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'MultiUserSelectDropdown',
			dataType: 'string',
		},
		{
			id: 'author_user_group',
			label: i18n.tText('admin/users/user___gebruikersgroep'),
			sortable: true,
			visibleByDefault: false,
			filterType: 'CheckboxDropdownModal',
			filterProps: {
				options: [
					...userGroupOptions,
					{
						label: i18n.tText('admin/content/content___leeg'),
						id: NULL_FILTER,
					},
				],
			} as CheckboxDropdownModalProps,
			dataType: 'string',
		},
		{
			id: 'created_at',
			label: i18n.tText('admin/content/content___aangemaakt'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'updated_at',
			label: i18n.tText('admin/content/content___laatst-bewerkt'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'is_public',
			label: i18n.tText('admin/content/content___publiek'),
			sortable: true,
			visibleByDefault: false,
			filterType: 'BooleanCheckboxDropdown',
			dataType: 'boolean',
		},
		{
			id: 'published_at',
			label: i18n.tText('admin/content/views/content-overview___publicatie'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'publish_at',
			label: i18n.tText('admin/content/views/content-overview___publiceer-op'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'depublish_at',
			label: i18n.tText('admin/content/views/content-overview___depubliceer-op'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'labels',
			label: i18n.tText('admin/content/content___labels'),
			sortable: false,
			visibleByDefault: false,
			filterType: 'CheckboxDropdownModal',
			filterProps: {
				options: contentPageLabelOptions,
			} as CheckboxDropdownModalProps,
		},
		{
			id: 'user_group_ids',
			label: i18n.tText('admin/content/content___zichtbaar-voor'),
			sortable: false,
			visibleByDefault: false,
		},
		{
			id: 'actions',
			tooltip: i18n.tText('admin/content/views/content-overview___acties'),
			visibleByDefault: true,
		},
	];
};

export const TABLE_COLUMN_TO_DATABASE_ORDER_OBJECT: Partial<{
	[columnId in ContentOverviewTableCols]: (order: Avo.Search.OrderDirection) => any;
}> = {
	user_profile_id: (order: Avo.Search.OrderDirection) => {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			return {
				owner_profile: { first_name: order },
			};
		}
		return {
			profile: { first_name: order },
		};
	},
	author_user_group: (order: Avo.Search.OrderDirection) => {
		if (
			AdminConfigManager.getConfig().database.databaseApplicationType ===
			AvoOrHetArchief.hetArchief
		) {
			return {
				owner_profile: { group: { name: order } },
			};
		}
		return {
			profile: { profile_user_group: { group: { label: order } } },
		};
	},
};

export const CONTENT_PAGE_PATH = {
	OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
	CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
	DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
	EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
	PAGES: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PAGINA`,
	NEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=NIEUWS_ITEM`,
	FAQS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=FAQ_ITEM`,
	SCREENCASTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=SCREENCAST`,
	PROJECTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PROJECT`,
	OVERVIEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=OVERZICHT`,
};

export const ITEMS_PER_PAGE = 10;

export const GET_CONTENT_PAGE_DETAIL_TABS: () => TabProps[] = () => [
	{
		id: 'inhoud',
		label: AdminConfigManager.getConfig().services.i18n.tText('admin/content/content___inhoud'),
		icon: 'layout',
	},
	{
		id: 'metadata',
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content/content___metadata'
		),
		icon: 'file-text',
	},
];

export const GET_CONTENT_PAGE_WIDTH_OPTIONS = () => [
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content/content___kies-een-content-breedte'
		),
		value: '',
		disabled: true,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content/content___max-1300-px'
		),
		value: ContentWidth.EXTRA_LARGE,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content/content___breed-940-px'
		),
		value: ContentWidth.LARGE,
	},
	{
		label: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content/content___medium-720-px'
		),
		value: ContentWidth.MEDIUM,
	},
];

export const DEFAULT_PAGES_WIDTH: { [key in ContentWidth]: Avo.ContentPage.Type[] } = {
	[ContentWidth.EXTRA_LARGE]: ['PROJECT'],
	[ContentWidth.LARGE]: [],
	[ContentWidth.MEDIUM]: ['NIEUWS_ITEM'],
};
