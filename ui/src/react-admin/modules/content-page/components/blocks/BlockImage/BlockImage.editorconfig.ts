import { ButtonAction, ButtonType } from '@viaa/avo2-components';
import { GET_ALIGN_OPTIONS } from '~modules/content-page/const/get-align-options';
import { GET_WIDTH_OPTIONS } from '~modules/content-page/const/get-media-player-width-options';
import { FileUploadProps } from '~shared/components/FileUpload/FileUpload';
import {
	AlignOption,
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ImageBlockComponentState,
} from '../../../types/content-block.types';

import { BLOCK_FIELD_DEFAULTS, BLOCK_STATE_DEFAULTS, FILE_FIELD, TEXT_FIELD } from '../defaults';

import { AdminConfigManager } from '~core/config';

export const INITIAL_IMAGE_COMPONENTS_STATE = (): ImageBlockComponentState => ({
	title: '',
	text: '',
	source: '',
	width: 'full-width',
});

export const INITIAL_IMAGE_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS({
		padding: {
			top: 'top-extra-large',
			bottom: 'bottom-extra-large',
		},
	});

export const IMAGE_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'admin/content-block/helpers/generators/image___afbeelding'
	),
	type: ContentBlockType.Image,
	components: {
		state: INITIAL_IMAGE_COMPONENTS_STATE(),
		fields: {
			title: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/image___bijschift-titel'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			},
			text: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/image___bijschrift-beschrijving'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			},
			imageSource: FILE_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/image___een-afbeelding-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/generators/image___afbeelding'
					),
					editorProps: { assetType: 'CONTENT_BLOCK_IMAGE' } as FileUploadProps,
				}
			),
			width: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/image___breedte'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_WIDTH_OPTIONS(),
				},
			},
			align: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/generators/image___alignatie'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
			imageAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'Link achter de afbeelding'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						'ITEM',
						'COLLECTION',
						'BUNDLE',
						'ASSIGNMENT',
						'CONTENT_PAGE',
						'PROJECTS',
						'INTERNAL_LINK',
						'EXTERNAL_LINK',
						'ANCHOR_LINK',
						'FILE',
					],
				},
			},
			imageAlt: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'Alt tekst voor de afbeelding'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonType: {
				label: AdminConfigManager.getConfig().services.i18n.tText('Knop type'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText('Knoptekst is verplicht'),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText('Knop tekst'),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText('Alt knop text'),
				editorType: ContentBlockEditor.TextInput,
			}),
			buttonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText('Knop actie'),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: [
						'ITEM',
						'COLLECTION',
						'BUNDLE',
						'ASSIGNMENT',
						'CONTENT_PAGE',
						'PROJECTS',
						'INTERNAL_LINK',
						'EXTERNAL_LINK',
						'ANCHOR_LINK',
						'FILE',
					],
				},
			},
			buttonAlign: {
				label: AdminConfigManager.getConfig().services.i18n.tText('Knop alignatie'),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_ALIGN_OPTIONS(),
				},
			},
		},
	},
	block: {
		state: INITIAL_IMAGE_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
