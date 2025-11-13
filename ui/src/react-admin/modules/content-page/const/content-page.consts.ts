import type { IconName, TabProps } from '@viaa/avo2-components';
import type { Avo } from '@viaa/avo2-types';

import { AdminConfigManager } from '~core/config/config.class';
import type { ContentOverviewTableCols } from '~modules/content-page/types/content-pages.types';
import { ContentPageWidth } from '~modules/content-page/types/content-pages.types';
import type {
	CheckboxDropdownModalProps,
	CheckboxOption,
} from '~shared/components/CheckboxDropdownModal/CheckboxDropdownModal';

import type { FilterableColumn } from '~shared/components/FilterTable/FilterTable';
import { NULL_FILTER } from '~shared/helpers/filters';
import { isMultiLanguageEnabled } from '~shared/helpers/is-multi-language-enabled';
import { tText } from '~shared/helpers/translation-functions';
import { TableColumnDataType } from '~shared/types/table-column-data-type';
import { TableFilterType } from '~shared/types/table-filter-types';

export const CONTENT_PAGE_DESCRIPTION_MAX_LENGTH = 165;
export const CONTENT_PAGE_DESCRIPTION_MAX_LENGTH_STRING = String(
	CONTENT_PAGE_DESCRIPTION_MAX_LENGTH
);
export const CONTENT_PAGE_SEO_DESCRIPTION_MAX_LENGTH = 158;
export const CONTENT_PAGE_SEO_DESCRIPTION_MAX_LENGTH_STRING = String(
	CONTENT_PAGE_SEO_DESCRIPTION_MAX_LENGTH
);

export const TEMP_BLOCK_ID_PREFIX = '__CONTENT_BLOCK_TEMP_ID__';

export const GET_OVERVIEW_COLUMNS: (
	contentTypeOptions: CheckboxOption[],
	userGroupOptions: CheckboxOption[],
	contentPageLabelOptions: CheckboxOption[],
	languageOptions: CheckboxOption[]
) => FilterableColumn<ContentOverviewTableCols>[] = (
	contentTypeOptions,
	userGroupOptions,
	contentPageLabelOptions,
	languageOptions
) => {
	const i18n = AdminConfigManager.getConfig().services.i18n;
	return [
		{
			id: 'title',
			label: i18n.tText('admin/content/content___titel'),
			sortable: true,
			visibleByDefault: true,
			dataType: TableColumnDataType.string,
		},
		{
			id: 'contentType',
			label: i18n.tText('admin/content/content___content-type'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.CheckboxDropdownModal,
			filterProps: {
				options: contentTypeOptions,
			} as CheckboxDropdownModalProps,
			dataType: TableColumnDataType.string,
		},
		{
			id: 'userProfileId',
			label: i18n.tText('admin/content/content___auteur'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.MultiUserSelectDropdown,
			dataType: TableColumnDataType.string,
		},
		{
			id: 'authorUserGroup',
			label: i18n.tText('admin/users/user___gebruikersgroep'),
			sortable: true,
			visibleByDefault: false,
			filterType: TableFilterType.CheckboxDropdownModal,
			filterProps: {
				options: [
					...userGroupOptions,
					{
						label: i18n.tText('admin/content/content___leeg'),
						id: NULL_FILTER,
					},
				],
			} as CheckboxDropdownModalProps,
			dataType: TableColumnDataType.string,
		},
		{
			id: 'createdAt',
			label: i18n.tText('admin/content/content___aangemaakt'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.DateRangeDropdown,
			dataType: TableColumnDataType.dateTime,
		},
		{
			id: 'updatedAt',
			label: i18n.tText('admin/content/content___laatst-bewerkt'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.DateRangeDropdown,
			dataType: TableColumnDataType.dateTime,
		},
		{
			id: 'isPublic',
			label: i18n.tText('admin/content/content___publiek'),
			sortable: true,
			visibleByDefault: false,
			filterType: TableFilterType.BooleanCheckboxDropdown,
			dataType: TableColumnDataType.boolean,
		},
		{
			id: 'publishedAt',
			label: i18n.tText('admin/content/views/content-overview___publicatie'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.DateRangeDropdown,
			dataType: TableColumnDataType.dateTime,
		},
		{
			id: 'publishAt',
			label: i18n.tText('admin/content/views/content-overview___publiceer-op'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.DateRangeDropdown,
			dataType: TableColumnDataType.dateTime,
		},
		{
			id: 'depublishAt',
			label: i18n.tText('admin/content/views/content-overview___depubliceer-op'),
			sortable: true,
			visibleByDefault: true,
			filterType: TableFilterType.DateRangeDropdown,
			dataType: TableColumnDataType.dateTime,
		},
		{
			id: 'labels',
			label: i18n.tText('admin/content/content___labels'),
			sortable: false,
			visibleByDefault: false,
			filterType: TableFilterType.CheckboxDropdownModal,
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
		...(isMultiLanguageEnabled()
			? [
					{
						id: 'translations' as const,
						label: i18n.tText('modules/content-page/const/content-page___vertalingen'),
						sortable: false,
						visibleByDefault: true,
						filterType: TableFilterType.CheckboxDropdownModal,
						filterProps: {
							options: languageOptions,
						} as CheckboxDropdownModalProps,
					},
				]
			: []),
		{
			id: 'actions',
			tooltip: i18n.tText('admin/content/views/content-overview___acties'),
			visibleByDefault: true,
		},
	];
};

export const PAGES_PER_PAGE = 10;

export const GET_CONTENT_PAGE_DETAIL_TABS: () => TabProps[] = () => [
	{
		id: 'inhoud',
		label: tText('admin/content/content___inhoud'),
		icon: 'layout' as IconName,
	},
	{
		id: 'metadata',
		label: tText('admin/content/content___metadata'),
		icon: 'fileText' as IconName,
	},
];

export const GET_CONTENT_PAGE_WIDTH_OPTIONS = () => [
	{
		label: tText('admin/content/content___kies-een-content-breedte'),
		value: '',
		disabled: true,
	},
	{
		label: tText('admin/content/content___max-1300-px'),
		value: ContentPageWidth.EXTRA_LARGE,
	},
	{
		label: tText('admin/content/content___breed-940-px'),
		value: ContentPageWidth.LARGE,
	},
	{
		label: tText('admin/content/content___medium-720-px'),
		value: ContentPageWidth.MEDIUM,
	},
];

export const DEFAULT_PAGES_WIDTH: { [key in ContentPageWidth]: Avo.ContentPage.Type[] } = {
	[ContentPageWidth.EXTRA_LARGE]: ['PROJECT'],
	[ContentPageWidth.LARGE]: [],
	[ContentPageWidth.MEDIUM]: ['NIEUWS_ITEM'],
};
