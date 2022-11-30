import { TabProps } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { ContentOverviewTableCols } from '~modules/content-page/types/content-pages.types';

import { FilterableColumn } from '../../shared/components/FilterTable/FilterTable';
import { ROUTE_PARTS } from '../../shared/consts/routes';
import { NULL_FILTER } from '../../shared/helpers/filters';
import { ContentWidth } from '~modules/content-page';

import { AdminConfigManager } from '~core/config';
import {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~modules/shared/components/CheckboxDropdownModal/CheckboxDropdownModal';

export const CONTENT_PAGE_QUERY_KEYS = {
	OVERVIEW: 'OVERVIEW',
};

export const GET_CONTENT_PAGE_OVERVIEW_COLUMNS: (
	contentTypeOptions: CheckboxOption[],
	userGroupOptions: CheckboxOption[],
	contentPageLabelOptions: CheckboxOption[]
) => FilterableColumn<ContentOverviewTableCols>[] = (
	contentTypeOptions,
	userGroupOptions,
	contentPageLabelOptions
) => {
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
			id: 'contentType',
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
			id: 'userProfileId',
			label: i18n.tText('admin/content/content___auteur'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'MultiUserSelectDropdown',
			dataType: 'string',
		},
		{
			id: 'authorUserGroup',
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
			id: 'createdAt',
			label: i18n.tText('admin/content/content___aangemaakt'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'updatedAt',
			label: i18n.tText('admin/content/content___laatst-bewerkt'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'isPublic',
			label: i18n.tText('admin/content/content___publiek'),
			sortable: true,
			visibleByDefault: false,
			filterType: 'BooleanCheckboxDropdown',
			dataType: 'boolean',
		},
		{
			id: 'publishedAt',
			label: i18n.tText('admin/content/views/content-overview___publicatie'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'publishAt',
			label: i18n.tText('admin/content/views/content-overview___publiceer-op'),
			sortable: true,
			visibleByDefault: true,
			filterType: 'DateRangeDropdown',
			dataType: 'dateTime',
		},
		{
			id: 'depublishAt',
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
			id: 'userGroupIds',
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

export const CONTENT_PATH = {
	CONTENT_PAGE_OVERVIEW: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}`,
	CONTENT_PAGE_CREATE: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/${ROUTE_PARTS.create}`,
	CONTENT_PAGE_DETAIL: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id`,
	CONTENT_PAGE_EDIT: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}/:id/${ROUTE_PARTS.edit}`,
	PAGES: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PAGINA`,
	NEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=NIEUWS_ITEM`,
	FAQS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=FAQ_ITEM`,
	SCREENCASTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=SCREENCAST`,
	PROJECTS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=PROJECT`,
	OVERVIEWS: `/${ROUTE_PARTS.admin}/${ROUTE_PARTS.content}?content_type=OVERZICHT`,
};

export const ITEMS_PER_PAGE = 10;

export const GET_CONTENT_DETAIL_TABS: () => TabProps[] = () => [
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

export const GET_CONTENT_WIDTH_OPTIONS = () => [
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

/* eslint-disable @typescript-eslint/no-unused-vars */
export const DEFAULT_PAGES_WIDTH: { [key in ContentWidth]: Avo.ContentPage.Type[] } = {
	[ContentWidth.EXTRA_LARGE]: ['PROJECT'],
	[ContentWidth.LARGE]: [],
	[ContentWidth.MEDIUM]: ['NIEUWS_ITEM'],
};
/* eslint-enable @typescript-eslint/no-unused-vars */
