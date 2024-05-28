import { type Avo, ContentPickerType } from '@viaa/avo2-types';
import { retrieveAssignments } from '~shared/components/ContentPicker/item-providers/assignment';
import { retrieveCustomNavigationElements } from '~shared/components/ContentPicker/item-providers/custom-navigation-elements';
import { retrieveIeObjects } from '~shared/components/ContentPicker/item-providers/ie-objects';
import { retrieveNlParentContentPages } from '~shared/components/ContentPicker/item-providers/nl-content-page-parent';
import { tText } from '~shared/helpers/translation-functions';

import { PickerTypeOption } from '../../types/content-picker';

import { retrieveAnchors } from './item-providers/anchors';
import { retrieveBundles, retrieveCollections } from './item-providers/collection';
import { retrieveContentPages, retrieveProjectContentPages } from './item-providers/content-page';
import { retrieveInternalLinks } from './item-providers/internal-link';
import { retrieveItems } from './item-providers/item';
import { retrieveProfiles } from './item-providers/profile';

export interface PickerItem {
	label?: string;
	type: Avo.Core.ContentPickerType;
	value: string;
	target?: Avo.Core.LinkTarget;
}

export const GET_CONTENT_TYPE_LABELS: () => Record<Avo.Core.ContentPickerType, string> = () => ({
	[ContentPickerType.CONTENT_PAGE]: tText('admin/content/content___content'),
	[ContentPickerType.NL_CONTENT_PAGE_PARENT_ID]: tText(
		'modules/shared/components/content-picker/content-picker___nederlandse-hoofd-pagina'
	),
	[ContentPickerType.INTERNAL_LINK]: tText('admin/content/content___statisch'),
	[ContentPickerType.COLLECTION]: tText('admin/content/content___collecties'),
	[ContentPickerType.ITEM]: tText('admin/content/content___items'),
	[ContentPickerType.BUNDLE]: tText('admin/content/content___bundels'),
	[ContentPickerType.ASSIGNMENT]: tText(
		'react-admin/modules/shared/components/content-picker/content-picker___opdrachten'
	),
	[ContentPickerType.EXTERNAL_LINK]: tText(
		'admin/shared/components/content-picker/content-picker___externe-url'
	),
	[ContentPickerType.SEARCH_QUERY]: tText(
		'admin/shared/components/content-picker/content-picker___zoekfilters'
	),
	[ContentPickerType.PROJECTS]: tText(
		'admin/shared/components/content-picker/content-picker___projecten'
	),
	[ContentPickerType.PROFILE]: tText(
		'admin/shared/components/content-picker/content-picker___gebruiker'
	),
	[ContentPickerType.ANCHOR_LINK]: tText(
		'admin/shared/components/content-picker/content-picker___anchors'
	),
	[ContentPickerType.FILE]: tText(
		'admin/shared/components/content-picker/content-picker___bestand'
	),
	[ContentPickerType.CUSTOM_NAVIGATION_ELEMENTS]: tText(
		'react-admin/modules/shared/components/content-picker/content-picker___custom-navigatie-items'
	),
	[ContentPickerType.IE_OBJECT]: tText(
		'modules/shared/components/content-picker/content-picker___ie-objects'
	),
	/**
	 * @deprecated, use CUSTOM_NAVIGATION_ELEMENTS instead
	 */
	[ContentPickerType.DROPDOWN]: tText(
		'react-admin/modules/shared/components/content-picker/content-picker___custom-navigatie-items'
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
			value: ContentPickerType.NL_CONTENT_PAGE_PARENT_ID,
			label: labels[ContentPickerType.NL_CONTENT_PAGE_PARENT_ID],
			disabled: false,
			fetch: retrieveNlParentContentPages,
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
			value: ContentPickerType.ASSIGNMENT,
			label: labels[ContentPickerType.ASSIGNMENT],
			disabled: false,
			fetch: retrieveAssignments,
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
			placeholder: tText(
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
		{
			value: ContentPickerType.CUSTOM_NAVIGATION_ELEMENTS,
			label: labels[ContentPickerType.CUSTOM_NAVIGATION_ELEMENTS],
			disabled: false,
			fetch: retrieveCustomNavigationElements,
			picker: 'SELECT',
		},
		{
			value: ContentPickerType.IE_OBJECT,
			label: labels[ContentPickerType.IE_OBJECT],
			disabled: false,
			fetch: retrieveIeObjects,
			picker: 'SELECT',
		},
	];
};

export const DEFAULT_ALLOWED_TYPES: Avo.Core.ContentPickerType[] = [
	ContentPickerType.CONTENT_PAGE,
	ContentPickerType.ITEM,
	ContentPickerType.COLLECTION,
	ContentPickerType.BUNDLE,
	ContentPickerType.ASSIGNMENT,
	ContentPickerType.INTERNAL_LINK,
	ContentPickerType.EXTERNAL_LINK,
	ContentPickerType.ANCHOR_LINK,
	ContentPickerType.FILE,
	ContentPickerType.PROFILE,
];

export const REACT_SELECT_DEFAULT_OPTIONS = {
	className: 'c-select',
	classNamePrefix: 'c-select',
};
