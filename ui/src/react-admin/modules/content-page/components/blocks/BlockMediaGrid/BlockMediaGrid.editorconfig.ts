import type { CheckboxProps, MultiRangeProps } from '@viaa/avo2-components';
import { Avo } from '@viaa/avo2-types';
import { AdminConfigManager } from '~core/config/config.class';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_COLOR_OPTIONS_EXTENDED_AVO,
} from '~modules/content-page/const/get-color-options';
import {
	GET_FULL_HEADING_TYPE_OPTIONS,
	GET_HEADING_TYPE_OPTIONS,
} from '~modules/content-page/const/get-heading-type-options';
import { parseSearchQuery } from '~modules/shared/components/ContentPicker/helpers/parse-picker';
import type { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import type { MaintainerSelectProps } from '~shared/components/MaintainerSelect/MaintainerSelect';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import { isAvo } from '~shared/helpers/is-avo';
import { tHtml, tText } from '~shared/helpers/translation-functions';
import { AVO } from '~shared/types';
import {
	type ContentBlockConfig,
	ContentBlockEditor,
	type ContentBlockField,
	ContentBlockType,
	type MediaGridBlockComponentState,
	type MediaGridBlockState,
} from '../../../types/content-block.types';
import {
	BACKGROUND_COLOR_EXTENDED_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

export const INITIAL_MEDIA_GRID_COMPONENTS_STATE = (): MediaGridBlockComponentState[] => [{}];

export const INITIAL_MEDIA_GRID_BLOCK_STATE = (): MediaGridBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-large',
			bottom: 'bottom-small',
		},
	}),
	titleType: 'h2',
	ctaTitle: '',
	ctaContent: '',
	ctaButtonLabel: '',
	ctaButtonAction: { type: Avo.Core.ContentPickerType.ITEM, value: '' },
	searchQuery: { type: Avo.Core.ContentPickerType.SEARCH_QUERY, value: '' },
	searchQueryLimit: '8',
});

const cuePointsIsVisible: ContentBlockField['isVisible'] = (_config, formGroupState) => {
	return (
		(formGroupState as MediaGridBlockComponentState).mediaItem?.type === 'ITEM_WITH_CUE_POINTS'
	);
};

export const MEDIA_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: tText('admin/content-block/helpers/generators/media-grid___media-tegels', {}, [AVO]),
	type: ContentBlockType.MediaGrid,
	components: {
		name: tText('admin/content-block/helpers/generators/media-grid___media-item', {}, [AVO]),
		state: INITIAL_MEDIA_GRID_COMPONENTS_STATE(),
		fields: {
			mediaItem: {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___selecteer-uit-items-en-collecties',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						'ITEM',
						'ITEM_WITH_CUE_POINTS',
						'COLLECTION',
						'BUNDLE',
						'ASSIGNMENT',
						'CONTENT_PAGE_NEWS_ITEM',
						'CONTENT_PAGE_PAGE',
						'CONTENT_PAGE_PROJECT',
						'CONTENT_PAGE_OVERVIEW',
						'CONTENT_PAGE_DOMAIN_DETAIL',
						'CONTENT_PAGE_EVENT_DETAIL',
						'CONTENT_PAGE_SCREENCAST',
					] as Avo.Core.ContentPickerType[],
				},
				fieldsToResetOnChange: ['startCuePoint', 'endCuePoint'],
			},
			startCuePoint: TEXT_FIELD(
				tText(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___startknippunt-is-verplicht',
					{},
					[AVO]
				),
				{
					label: tText(
						'modules/content-page/components/blocks/block-media-grid/block-media-grid___startknippunt-seconden',
						{},
						[AVO]
					),
					editorType: ContentBlockEditor.TextInput,
					editorProps: {
						type: 'number',
					},
					isVisible: cuePointsIsVisible,
				}
			),
			endCuePoint: TEXT_FIELD(
				tText(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___eindknippunt-is-verplicht',
					{},
					[AVO]
				),
				{
					label: tText(
						'modules/content-page/components/blocks/block-media-grid/block-media-grid___eindknippunt-seconden',
						{},
						[AVO]
					),
					editorType: ContentBlockEditor.TextInput,
					editorProps: {
						type: 'number',
					},
					isVisible: cuePointsIsVisible,
				}
			),
			mediaItemLabel: TEXT_FIELD(undefined, {
				label: tText(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___alternatieve-titel',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			copyrightImage: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-media-grid/block-media-grid___afbeelding',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.UploadOrSelectVideoStill,
			},
			copyrightOwnerOrId: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-media-grid/block-media-grid___auteursrecht',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.MaintainerSelect,
				editorProps: {
					extraSelectOptions: [
						{
							label: tText(
								'react-admin/modules/content-page/components/blocks/block-media-grid/block-media-grid___geen-auteursrecht-vermelding',
								{},
								[AVO]
							),
							value: 'NO_COPYRIGHT_NOTICE',
						},
					],
				} as Partial<MaintainerSelectProps>,
				validator: (value: string) => {
					const errorArray: string[] = [];

					if (!value) {
						errorArray.push(
							tText(
								'react-admin/modules/content-page/components/blocks/block-media-grid/block-media-grid___je-moet-een-keuze-maken-over-auteursrecht-van-de-video-still',
								{},
								[AVO]
							)
						);
					}

					return errorArray;
				},
			},
			buttonLabel: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___knop-tekst', {}, [AVO]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___alt-title-text', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonIcon: {
				label: tText('admin/content-block/helpers/generators/media-grid___knop-icoon', {}, [AVO]),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonType: {
				label: tText('admin/content-block/helpers/generators/media-grid___knop-type', {}, [AVO]),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonAction: {
				label: tText('admin/content-block/helpers/generators/media-grid___knop-actie', {}, [AVO]),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},
	block: {
		state: INITIAL_MEDIA_GRID_BLOCK_STATE(),
		fields: {
			title: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___algemene-titel', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			titleType: {
				label: tText(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___stijl',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			buttonLabel: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___algemene-knop-tekst',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___alt-title-text', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAction: {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___algemene-knop-actie',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			searchQuery: {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___voeg-een-zoek-filter-toe',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['SEARCH_QUERY'] as Avo.Core.ContentPickerType[],
					hideTypeDropdown: true,
				},
				note: tHtml(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___opgelet-mediategels-met-een-zoekfilter-mogen-niet-op-een-publieke-pagina-worden-gebruikt-wegens-geen-bronvermeldingen',
					{},
					[AVO]
				),
				validator: (input: { value: string }) => {
					const { value } = input;
					const errors: string[] = [];

					if (!value) {
						return errors; // Valid, optional field
					}

					if (parseSearchQuery(value) === null) {
						errors.push(
							tText(
								'admin/shared/helpers/content-picker/parse-picker___gelieve-een-correcte-zoekfilter-link-in-te-vullen',
								{},
								[AVO]
							)
						);
					}

					return errors;
				},
			},
			searchQueryLimit: {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___zoekresultaten-limiet',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.MultiRange,
				editorProps: {
					min: 0,
					max: 20,
					step: 1,
					showNumber: true,
				} as MultiRangeProps,
			},
			openMediaInModal: {
				editorType: ContentBlockEditor.Checkbox,
				editorProps: {
					label: tText(
						'admin/content-block/helpers/generators/media-grid___media-items-openen-in-een-popup',
						{},
						[AVO]
					),
				} as CheckboxProps,
				note: tHtml(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___let-op-je-hebt-geknipt-fragment-gekozen-vergeet-niet-om-deze-optie-aan-te-vinken',
					{},
					[AVO]
				),
				isNoteVisible: (entireConfig) =>
					(entireConfig.components.state as MediaGridBlockComponentState[]).some(
						(component) => component.mediaItem?.type === 'ITEM_WITH_CUE_POINTS'
					),
			},
			ctaTitle: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-titel', {}, [AVO]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			ctaTitleColor: FOREGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/media-grid___cta-titel-kleur', {}, [AVO])
			),
			ctaTitleBackgroundColor: BACKGROUND_COLOR_EXTENDED_FIELD(
				tText(
					'modules/content-page/components/blocks/block-media-grid/block-media-grid___cta-title-achtergrondkleur',
					{},
					[AVO]
				)
			),
			ctaTitleSize: {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-titel-grootte', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
			},
			ctaContent: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-omschrijving', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.TextArea,
				validator: undefined,
			}),
			ctaContentColor: FOREGROUND_COLOR_FIELD(
				tText('admin/content-block/helpers/generators/media-grid___cta-omschrijving-kleur', {}, [
					AVO,
				])
			),
			ctaButtonLabel: TEXT_FIELD(undefined, {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-knop-tekst', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			ctaButtonAltTitle: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___alt-button-title-text',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			ctaButtonIcon: {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-knop-icoon', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			ctaButtonType: {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-knop-type', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			ctaButtonAction: {
				label: tText('admin/content-block/helpers/generators/media-grid___cta-knop-actie', {}, [
					AVO,
				]),
				editorType: ContentBlockEditor.ContentPicker,
			},
			ctaBackgroundColor: BACKGROUND_COLOR_EXTENDED_FIELD(
				tText('admin/content-block/helpers/generators/media-grid___cta-achtergrond-kleur', {}, [
					AVO,
				]),
				isAvo() ? GET_COLOR_OPTIONS_EXTENDED_AVO()[1] : GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
			),
			ctaBackgroundImage: {
				label: tText(
					'admin/content-block/helpers/generators/media-grid___cta-achtergrond-afbeelding',
					{},
					[AVO]
				),
				editorType: ContentBlockEditor.FileUpload,
				validator: undefined,
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
				} as FileUploadProps,
			},
			...BLOCK_FIELD_DEFAULTS(),
		},
	},
});
