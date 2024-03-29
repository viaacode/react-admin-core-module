import type { Avo } from '@viaa/avo2-types';
import { retrieveAssignments } from '~shared/components/ContentPicker/item-providers/assignment';
import { retrieveCustomNavigationElements } from '~shared/components/ContentPicker/item-providers/custom-navigation-elements';

import { PickerTypeOption } from '../../types/content-picker';

import { retrieveAnchors } from './item-providers/anchors';
import { retrieveBundles, retrieveCollections } from './item-providers/collection';
import { retrieveContentPages, retrieveProjectContentPages } from './item-providers/content-page';
import { retrieveInternalLinks } from './item-providers/internal-link';
import { retrieveItems } from './item-providers/item';
import { retrieveProfiles } from './item-providers/profile';

import { AdminConfigManager } from '~core/config';

export interface PickerItem {
	label?: string;
	type: Avo.Core.ContentPickerType;
	value: string;
	target?: Avo.Core.LinkTarget;
}

export const GET_CONTENT_TYPE_LABELS: () => Record<Avo.Core.ContentPickerType, string> = () => ({
	['CONTENT_PAGE']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content/content___content'
	),
	['INTERNAL_LINK']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content/content___statisch'
	),
	['COLLECTION']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content/content___collecties'
	),
	['ITEM']: AdminConfigManager.getConfig().services.i18n.tText('admin/content/content___items'),
	['BUNDLE']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content/content___bundels'
	),
	['ASSIGNMENT']: AdminConfigManager.getConfig().services.i18n.tText(
		'react-admin/modules/shared/components/content-picker/content-picker___opdrachten'
	),
	['EXTERNAL_LINK']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___externe-url'
	),
	['SEARCH_QUERY']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___zoekfilters'
	),
	['PROJECTS']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___projecten'
	),
	['PROFILE']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___gebruiker'
	),
	['ANCHOR_LINK']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___anchors'
	),
	['FILE']: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/shared/components/content-picker/content-picker___bestand'
	),
	['CUSTOM_NAVIGATION_ELEMENTS']: AdminConfigManager.getConfig().services.i18n.tText(
		'react-admin/modules/shared/components/content-picker/content-picker___custom-navigatie-items'
	),
	['DROPDOWN']: AdminConfigManager.getConfig().services.i18n.tText(
		'react-admin/modules/shared/components/content-picker/content-picker___custom-navigatie-items'
	),
});

export const GET_CONTENT_TYPES: () => PickerTypeOption[] = () => {
	const labels = GET_CONTENT_TYPE_LABELS();
	return [
		{
			value: 'CONTENT_PAGE',
			label: labels['CONTENT_PAGE'],
			disabled: false,
			fetch: retrieveContentPages,
			picker: 'SELECT',
		},
		{
			value: 'INTERNAL_LINK',
			label: labels['INTERNAL_LINK'],
			disabled: false,
			fetch: retrieveInternalLinks,
			picker: 'SELECT',
		},
		{
			value: 'COLLECTION',
			label: labels['COLLECTION'],
			disabled: false,
			fetch: retrieveCollections,
			picker: 'SELECT',
		},
		{
			value: 'ITEM',
			label: labels['ITEM'],
			disabled: false,
			fetch: retrieveItems,
			picker: 'SELECT',
		},
		{
			value: 'BUNDLE',
			label: labels['BUNDLE'],
			disabled: false,
			fetch: retrieveBundles,
			picker: 'SELECT',
		},
		{
			value: 'ASSIGNMENT',
			label: labels['ASSIGNMENT'],
			disabled: false,
			fetch: retrieveAssignments,
			picker: 'SELECT',
		},
		{
			value: 'EXTERNAL_LINK',
			label: labels['EXTERNAL_LINK'],
			disabled: false,
			picker: 'TEXT_INPUT',
			placeholder: 'https://',
		},
		{
			value: 'SEARCH_QUERY',
			label: labels['SEARCH_QUERY'],
			disabled: false,
			picker: 'TEXT_INPUT',
			placeholder: AdminConfigManager.getConfig().services.i18n.tText(
				'admin/shared/components/content-picker/content-picker___plak-hier-uw-zoekpagina-url'
			),
		},
		{
			value: 'PROJECTS',
			label: labels['PROJECTS'],
			disabled: false,
			fetch: retrieveProjectContentPages,
			picker: 'SELECT',
		},
		{
			value: 'PROFILE',
			label: labels['PROFILE'],
			disabled: false,
			fetch: retrieveProfiles,
			picker: 'SELECT',
		},
		{
			value: 'ANCHOR_LINK',
			label: labels['ANCHOR_LINK'],
			disabled: false,
			fetch: retrieveAnchors,
			picker: 'SELECT',
		},
		{
			value: 'FILE',
			label: labels['FILE'],
			disabled: false,
			picker: 'FILE_UPLOAD',
		},
		{
			value: 'CUSTOM_NAVIGATION_ELEMENTS',
			label: labels['CUSTOM_NAVIGATION_ELEMENTS'],
			disabled: false,
			fetch: retrieveCustomNavigationElements,
			picker: 'SELECT',
		},
	];
};

export const DEFAULT_ALLOWED_TYPES: Avo.Core.ContentPickerType[] = [
	'CONTENT_PAGE',
	'ITEM',
	'COLLECTION',
	'BUNDLE',
	'ASSIGNMENT',
	'INTERNAL_LINK',
	'EXTERNAL_LINK',
	'ANCHOR_LINK',
	'FILE',
	'PROFILE',
];

export const REACT_SELECT_DEFAULT_OPTIONS = {
	className: 'c-select',
	classNamePrefix: 'c-select',
};
