import { AvoCoreContentPickerType, type AvoCoreLinkTarget } from '@viaa/avo2-types';
import { retrieveAssignments } from '~shared/components/ContentPicker/item-providers/assignment';
import { retrieveCustomNavigationElements } from '~shared/components/ContentPicker/item-providers/custom-navigation-elements';
import { retrieveIeObjects } from '~shared/components/ContentPicker/item-providers/ie-objects';
import { retrieveNlParentContentPages } from '~shared/components/ContentPicker/item-providers/nl-content-page-parent';
import { tText } from '~shared/helpers/translation-functions';
import type { PickerTypeOption } from '../../types/content-picker';
import { retrieveAnchors } from './item-providers/anchors';
import { retrieveBundles, retrieveCollections } from './item-providers/collection';
import { retrieveContentPages, retrieveProjectContentPages } from './item-providers/content-page';
import { retrieveInternalLinks } from './item-providers/internal-link';
import { retrieveItems } from './item-providers/item';
import { retrieveProfiles } from './item-providers/profile';

export interface PickerItem {
	label?: string;
	type: AvoCoreContentPickerType;
	value: string;
	target?: AvoCoreLinkTarget;
}

export const GET_CONTENT_TYPE_LABELS: () => Record<AvoCoreContentPickerType, string> = () => ({
	[AvoCoreContentPickerType.CONTENT_PAGE]: tText('admin/content/content___content'),
	[AvoCoreContentPickerType.CONTENT_PAGE_NEWS_ITEM]: tText(
		'modules/shared/components/content-picker/content-picker___nieuws-item'
	),
	[AvoCoreContentPickerType.CONTENT_PAGE_PAGE]: tText(
		'modules/shared/components/content-picker/content-picker___pagina'
	),
	[AvoCoreContentPickerType.CONTENT_PAGE_PROJECT]: tText(
		'modules/shared/components/content-picker/content-picker___project'
	),
	[AvoCoreContentPickerType.CONTENT_PAGE_OVERVIEW]: tText(
		'modules/shared/components/content-picker/content-picker___overzicht'
	),
	[AvoCoreContentPickerType.CONTENT_PAGE_DOMAIN_DETAIL]: tText(
		'modules/shared/components/content-picker/content-picker___domein-detail'
	),
	[AvoCoreContentPickerType.CONTENT_PAGE_EVENT_DETAIL]: tText(
		'modules/shared/components/content-picker/content-picker___event-detail'
	),
	[AvoCoreContentPickerType.CONTENT_PAGE_SCREENCAST]: tText(
		'modules/shared/components/content-picker/content-picker___hulpfilmpje'
	),
	[AvoCoreContentPickerType.NL_CONTENT_PAGE_PARENT_ID]: tText(
		'modules/shared/components/content-picker/content-picker___nederlandse-hoofd-pagina'
	),
	[AvoCoreContentPickerType.INTERNAL_LINK]: tText('admin/content/content___statisch'),
	[AvoCoreContentPickerType.COLLECTION]: tText('admin/content/content___collecties'),
	[AvoCoreContentPickerType.ITEM]: tText('admin/content/content___items'),
	[AvoCoreContentPickerType.ITEM_WITH_CUE_POINTS]: tText(
		'modules/shared/components/content-picker/content-picker___geknipte-fragmenten'
	),
	[AvoCoreContentPickerType.BUNDLE]: tText('admin/content/content___bundels'),
	[AvoCoreContentPickerType.ASSIGNMENT]: tText(
		'react-admin/modules/shared/components/content-picker/content-picker___opdrachten'
	),
	[AvoCoreContentPickerType.EXTERNAL_LINK]: tText(
		'admin/shared/components/content-picker/content-picker___externe-url'
	),
	[AvoCoreContentPickerType.SEARCH_QUERY]: tText(
		'admin/shared/components/content-picker/content-picker___zoekfilters'
	),
	[AvoCoreContentPickerType.PROJECTS]: tText(
		'admin/shared/components/content-picker/content-picker___projecten'
	),
	[AvoCoreContentPickerType.PROFILE]: tText(
		'admin/shared/components/content-picker/content-picker___gebruiker'
	),
	[AvoCoreContentPickerType.ANCHOR_LINK]: tText(
		'admin/shared/components/content-picker/content-picker___anchors'
	),
	[AvoCoreContentPickerType.FILE]: tText(
		'admin/shared/components/content-picker/content-picker___bestand'
	),
	[AvoCoreContentPickerType.CUSTOM_NAVIGATION_ELEMENTS]: tText(
		'react-admin/modules/shared/components/content-picker/content-picker___custom-navigatie-items'
	),
	[AvoCoreContentPickerType.IE_OBJECT]: tText(
		'modules/shared/components/content-picker/content-picker___ie-objects'
	),
	/**
	 * @deprecated, use CUSTOM_NAVIGATION_ELEMENTS instead
	 */
	[AvoCoreContentPickerType.DROPDOWN]: tText(
		'react-admin/modules/shared/components/content-picker/content-picker___custom-navigatie-items'
	),
});

const getContentTypeForContentPage = (
	contentType:
		| AvoCoreContentPickerType.CONTENT_PAGE
		| AvoCoreContentPickerType.CONTENT_PAGE_NEWS_ITEM
		| AvoCoreContentPickerType.CONTENT_PAGE_PAGE
		| AvoCoreContentPickerType.CONTENT_PAGE_PROJECT
		| AvoCoreContentPickerType.CONTENT_PAGE_OVERVIEW
		| AvoCoreContentPickerType.CONTENT_PAGE_DOMAIN_DETAIL
		| AvoCoreContentPickerType.CONTENT_PAGE_EVENT_DETAIL
		| AvoCoreContentPickerType.CONTENT_PAGE_SCREENCAST
) => {
	const labels = GET_CONTENT_TYPE_LABELS();

	return {
		value: contentType as AvoCoreContentPickerType,
		label: labels[contentType],
		disabled: false,
		fetch: retrieveContentPages,
		picker: 'SELECT',
	} as PickerTypeOption;
};

export const GET_CONTENT_TYPES: () => PickerTypeOption[] = () => {
	const labels = GET_CONTENT_TYPE_LABELS();
	return [
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE),
		{
			value: AvoCoreContentPickerType.NL_CONTENT_PAGE_PARENT_ID,
			label: labels[AvoCoreContentPickerType.NL_CONTENT_PAGE_PARENT_ID],
			disabled: false,
			fetch: retrieveNlParentContentPages,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.INTERNAL_LINK,
			label: labels[AvoCoreContentPickerType.INTERNAL_LINK],
			disabled: false,
			fetch: retrieveInternalLinks,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.COLLECTION,
			label: labels[AvoCoreContentPickerType.COLLECTION],
			disabled: false,
			fetch: retrieveCollections,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.ITEM,
			label: labels[AvoCoreContentPickerType.ITEM],
			disabled: false,
			fetch: retrieveItems,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.ITEM_WITH_CUE_POINTS,
			label: labels[AvoCoreContentPickerType.ITEM_WITH_CUE_POINTS],
			disabled: false,
			fetch: retrieveItems,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.BUNDLE,
			label: labels[AvoCoreContentPickerType.BUNDLE],
			disabled: false,
			fetch: retrieveBundles,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.ASSIGNMENT,
			label: labels[AvoCoreContentPickerType.ASSIGNMENT],
			disabled: false,
			fetch: retrieveAssignments,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.EXTERNAL_LINK,
			label: labels[AvoCoreContentPickerType.EXTERNAL_LINK],
			disabled: false,
			picker: 'TEXT_INPUT',
			placeholder: 'https://',
		},
		{
			value: AvoCoreContentPickerType.SEARCH_QUERY,
			label: labels[AvoCoreContentPickerType.SEARCH_QUERY],
			disabled: false,
			picker: 'TEXT_INPUT',
			placeholder: tText(
				'admin/shared/components/content-picker/content-picker___plak-hier-uw-zoekpagina-url'
			),
		},
		{
			value: AvoCoreContentPickerType.PROJECTS,
			label: labels[AvoCoreContentPickerType.PROJECTS],
			disabled: false,
			fetch: retrieveProjectContentPages,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.PROFILE,
			label: labels[AvoCoreContentPickerType.PROFILE],
			disabled: false,
			fetch: retrieveProfiles,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.ANCHOR_LINK,
			label: labels[AvoCoreContentPickerType.ANCHOR_LINK],
			disabled: false,
			fetch: retrieveAnchors,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.FILE,
			label: labels[AvoCoreContentPickerType.FILE],
			disabled: false,
			picker: 'FILE_UPLOAD',
		},
		{
			value: AvoCoreContentPickerType.CUSTOM_NAVIGATION_ELEMENTS,
			label: labels[AvoCoreContentPickerType.CUSTOM_NAVIGATION_ELEMENTS],
			disabled: false,
			fetch: retrieveCustomNavigationElements,
			picker: 'SELECT',
		},
		{
			value: AvoCoreContentPickerType.IE_OBJECT,
			label: labels[AvoCoreContentPickerType.IE_OBJECT],
			disabled: false,
			fetch: retrieveIeObjects,
			picker: 'SELECT',
		},
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_NEWS_ITEM),
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_PAGE),
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_PROJECT),
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_OVERVIEW),
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_DOMAIN_DETAIL),
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_EVENT_DETAIL),
		getContentTypeForContentPage(AvoCoreContentPickerType.CONTENT_PAGE_SCREENCAST),
	];
};

export const DEFAULT_ALLOWED_TYPES: AvoCoreContentPickerType[] = [
	AvoCoreContentPickerType.CONTENT_PAGE,
	AvoCoreContentPickerType.ITEM,
	AvoCoreContentPickerType.COLLECTION,
	AvoCoreContentPickerType.BUNDLE,
	AvoCoreContentPickerType.ASSIGNMENT,
	AvoCoreContentPickerType.INTERNAL_LINK,
	AvoCoreContentPickerType.EXTERNAL_LINK,
	AvoCoreContentPickerType.ANCHOR_LINK,
	AvoCoreContentPickerType.FILE,
	AvoCoreContentPickerType.PROFILE,
];

export const REACT_SELECT_DEFAULT_OPTIONS = {
	className: 'c-select',
	classNamePrefix: 'c-select',
};
