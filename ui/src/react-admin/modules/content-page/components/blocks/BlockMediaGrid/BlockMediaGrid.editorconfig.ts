import { CheckboxProps, MultiRangeProps } from '@viaa/avo2-components';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_BACKGROUND_COLOR_OPTIONS_AVO,
} from '~modules/content-page/const/get-color-options';
import { GET_FULL_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import type { Avo } from '@viaa/avo2-types';
import { isAvo } from '~shared/helpers/is-avo';

import { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '~shared/consts/icons.consts';
import {
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	MediaGridBlockComponentState,
	MediaGridBlockState,
} from '../../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_MEDIA_GRID_COMPONENTS_STATE = (): MediaGridBlockComponentState[] => [{}];

export const INITIAL_MEDIA_GRID_BLOCK_STATE = (): MediaGridBlockState => ({
	...BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-large',
			bottom: 'bottom-small',
		},
	}),
	ctaTitle: '',
	ctaContent: '',
	ctaButtonLabel: '',
	ctaButtonAction: { type: 'ITEM', value: '' },
	searchQuery: { type: 'SEARCH_QUERY', value: '' },
	searchQueryLimit: '8',
});

export const MEDIA_GRID_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/media-grid___media-tegels'
	),
	type: ContentBlockType.MediaGrid,
	components: {
		name: AdminConfigManager.getConfig().services.i18n.tText(
			'admin/content-block/helpers/generators/media-grid___media-item'
		),
		state: INITIAL_MEDIA_GRID_COMPONENTS_STATE(),
		fields: {
			mediaItem: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___selecteer-uit-items-en-collecties'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						'ITEM',
						'COLLECTION',
						'BUNDLE',
						'ASSIGNMENT',
					] as Avo.Core.ContentPickerType[],
				},
			},
			buttonLabel: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonIcon: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
		},
	},
	block: {
		state: INITIAL_MEDIA_GRID_BLOCK_STATE(),
		fields: {
			title: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___algemene-titel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonLabel: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___algemene-knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___algemene-knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			searchQuery: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___voeg-een-zoek-filter-toe'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['SEARCH_QUERY'] as Avo.Core.ContentPickerType[],
					hideTypeDropdown: true,
				},
			},
			searchQueryLimit: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___zoekresultaten-limiet'
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
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/media-grid___media-items-openen-in-een-popup'
					),
				} as CheckboxProps,
			},
			ctaTitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-titel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			ctaTitleColor: FOREGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-titel-kleur'
				)
			),
			ctaTitleSize: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-titel-grootte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_FULL_HEADING_TYPE_OPTIONS(),
				},
			},
			ctaContent: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-omschrijving'
				),
				editorType: ContentBlockEditor.TextArea,
				validator: undefined,
			}),
			ctaContentColor: FOREGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-omschrijving-kleur'
				)
			),
			ctaButtonLabel: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			ctaButtonAltTitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___alt-button-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			ctaButtonIcon: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			ctaButtonType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			ctaButtonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
			},
			ctaBackgroundColor: BACKGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-achtergrond-kleur'
				),
				isAvo()
					? GET_BACKGROUND_COLOR_OPTIONS_AVO()[1]
					: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
			),
			ctaBackgroundImage: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/media-grid___cta-achtergrond-afbeelding'
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
