import { ContentPickerTypeSchema, LinkTargetSchema } from '@viaa/avo2-types/types/core';

import { i18n } from '../../helpers/i18n';
import { PickerTypeOption } from '../../types/content-picker';

import { retrieveAnchors } from './item-providers/anchors';
import { retrieveBundles, retrieveCollections } from './item-providers/collection';
import { retrieveContentPages, retrieveProjectContentPages } from './item-providers/content-page';
import { retrieveInternalLinks } from './item-providers/internal-link';
import { retrieveItems } from './item-providers/item';
import { retrieveProfiles } from './item-providers/profile';

export enum ContentPickerType {
	CONTENT_PAGE = 'CONTENT_PAGE',
	INTERNAL_LINK = 'INTERNAL_LINK',
	COLLECTION = 'COLLECTION',
	ITEM = 'ITEM',
	BUNDLE = 'BUNDLE',
	EXTERNAL_LINK = 'EXTERNAL_LINK',
	SEARCH_QUERY = 'SEARCH_QUERY',
	PROJECTS = 'PROJECTS',
	PROFILE = 'PROFILE',
	ANCHOR_LINK = 'ANCHOR_LINK',
	FILE = 'FILE',
}

export interface PickerItem {
	label?: string;
	type: ContentPickerTypeSchema;
	value: string;
	target?: LinkTargetSchema;
}

export const GET_CONTENT_TYPE_LABELS: () => Record<ContentPickerType, string> = () => ({
	[ContentPickerType.CONTENT_PAGE]: i18n.t('admin/content/content___content'),
	[ContentPickerType.INTERNAL_LINK]: i18n.t('admin/content/content___statisch'),
	[ContentPickerType.COLLECTION]: i18n.t('admin/content/content___collecties'),
	[ContentPickerType.ITEM]: i18n.t('admin/content/content___items'),
	[ContentPickerType.BUNDLE]: i18n.t('admin/content/content___bundels'),
	[ContentPickerType.EXTERNAL_LINK]: i18n.t(
		'admin/shared/components/content-picker/content-picker___externe-url'
	),
	[ContentPickerType.SEARCH_QUERY]: i18n.t(
		'admin/shared/components/content-picker/content-picker___zoekfilters'
	),
	[ContentPickerType.PROJECTS]: i18n.t(
		'admin/shared/components/content-picker/content-picker___projecten'
	),
	[ContentPickerType.PROFILE]: i18n.t(
		'admin/shared/components/content-picker/content-picker___gebruiker'
	),
	[ContentPickerType.ANCHOR_LINK]: i18n.t(
		'admin/shared/components/content-picker/content-picker___anchors'
	),
	[ContentPickerType.FILE]: i18n.t(
		'admin/shared/components/content-picker/content-picker___bestand'
	),
});

export const GET_CONTENT_TYPES: () => PickerTypeOption[] = () => {
	const labels = GET_CONTENT_TYPE_LABELS();
	return [
		{
			value: ContentPickerType.CONTENT_PAGE,
			label: labels[ContentPickerType.CONTENT_PAGE],
			disabled: false,
			fetch: retrieveContentPages,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.INTERNAL_LINK,
			label: labels[ContentPickerType.INTERNAL_LINK],
			disabled: false,
			fetch: retrieveInternalLinks,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.COLLECTION,
			label: labels[ContentPickerType.COLLECTION],
			disabled: false,
			fetch: retrieveCollections,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.ITEM,
			label: labels[ContentPickerType.ITEM],
			disabled: false,
			fetch: retrieveItems,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.BUNDLE,
			label: labels[ContentPickerType.BUNDLE],
			disabled: false,
			fetch: retrieveBundles,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.EXTERNAL_LINK,
			label: labels[ContentPickerType.EXTERNAL_LINK],
			disabled: false,
			picker: 'TEXT_INPUT',
			placeholder: 'https://',
		},
		{
			value: ContentPickerType.SEARCH_QUERY,
			label: labels[ContentPickerType.SEARCH_QUERY],
			disabled: false,
			picker: 'TEXT_INPUT',
			placeholder: i18n.t(
				'admin/shared/components/content-picker/content-picker___plak-hier-uw-zoekpagina-url'
			),
		},
		{
			value: ContentPickerType.PROJECTS,
			label: labels[ContentPickerType.PROJECTS],
			disabled: false,
			fetch: retrieveProjectContentPages,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.PROFILE,
			label: labels[ContentPickerType.PROFILE],
			disabled: false,
			fetch: retrieveProfiles,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.ANCHOR_LINK,
			label: labels[ContentPickerType.ANCHOR_LINK],
			disabled: false,
			fetch: retrieveAnchors,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.FILE,
			label: labels[ContentPickerType.FILE],
			disabled: false,
			picker: 'FILE_UPLOAD',
		},
	];
};

export const DEFAULT_ALLOWED_TYPES: ContentPickerType[] = [
	ContentPickerType.CONTENT_PAGE,
	ContentPickerType.ITEM,
	ContentPickerType.COLLECTION,
	ContentPickerType.BUNDLE,
	ContentPickerType.INTERNAL_LINK,
	ContentPickerType.EXTERNAL_LINK,
	ContentPickerType.ANCHOR_LINK,
	ContentPickerType.FILE,
];

export const REACT_SELECT_DEFAULT_OPTIONS = {
	className: 'c-select',
	classNamePrefix: 'c-select',
};
