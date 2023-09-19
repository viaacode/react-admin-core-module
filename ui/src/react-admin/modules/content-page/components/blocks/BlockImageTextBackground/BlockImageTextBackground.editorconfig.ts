import {
	Color,
	ContentBlockConfig,
	ContentBlockEditor,
	ContentBlockType,
	DefaultContentBlockState,
	ImageTextBackgroundBlockComponentState,
} from '../../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

import { AdminConfigManager } from '~core/config';
import { isAvo } from '~modules/shared/helpers/is-avo';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import {
	GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF,
	GET_BACKGROUND_COLOR_OPTIONS_AVO,
} from '~modules/content-page/const/get-color-options';
import { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload';
import {
	GET_BACKGROUND_ALIGN_OPTIONS,
	GET_SIMPLE_ALIGN_OPTIONS,
} from '~modules/content-page/const/get-align-options';
import { GET_ADMIN_ICON_OPTIONS } from '~modules/shared/consts/icons.consts';

export const INITIAL_IMAGE_TEXT_BACKGROUND_COMPONENTS_STATE =
	(): ImageTextBackgroundBlockComponentState => ({
		heading: '',
		headingType: 'h3',
		content: '',
		foregroundColor: Color.Black,
		backgroundColor: Color.White,
		backgroundAlignment: 'left-inside-page',
		buttonLabel: '',
		buttonIconAlignment: 'left',
	});

export const INITIAL_IMAGE_TEXT_BACKGROUND_BLOCK_STATE = (): DefaultContentBlockState =>
	BLOCK_STATE_DEFAULTS();

export const IMAGE_TEXT_BACKGROUND_BLOCK_CONFIG = (position = 0): ContentBlockConfig => ({
	position,
	name: AdminConfigManager.getConfig().services.i18n.tText(
		'react-admin/modules/content-page/components/blocks/block-image-text-background/block-image-text-background___admin-content-block-helpers-image-text-background-image-text-background'
	),
	type: ContentBlockType.ImageTextBackground,
	components: {
		state: INITIAL_IMAGE_TEXT_BACKGROUND_COMPONENTS_STATE(),
		fields: {
			heading: TEXT_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___titel-is-verplicht'
				),
				{
					label: AdminConfigManager.getConfig().services.i18n.tText(
						'admin/content-block/helpers/image-text-background/image-text-background___titel-tekst'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			headingType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___titel-stijl'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_HEADING_TYPE_OPTIONS(),
				},
			},
			content: TEXT_FIELD(undefined, {
				editorType: ContentBlockEditor.TextInput,
			}),
			image: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/image-text-background/image-text-background___image'
				),
				editorType: ContentBlockEditor.FileUpload,
				validator: undefined,
				editorProps: {
					assetType: 'CONTENT_BLOCK_IMAGE',
					allowMulti: false,
				} as FileUploadProps,
			},
			buttonType: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAction: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
				},
			},
			buttonIcon: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonIconAlignment: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/image-text-background/image-text-background___button-icon-alignment'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_SIMPLE_ALIGN_OPTIONS(),
				},
			},
			imageAlignment: {
				label: AdminConfigManager.getConfig().services.i18n.tText(
					'react-admin/modules/content-page/components/blocks/block-image-text-background/block-image-text-background___afbeelding-uitlijning'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_BACKGROUND_ALIGN_OPTIONS(),
				},
			},
			foregroundColor: FOREGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___voorgrond-kleur'
				)
			),
			backgroundColor: BACKGROUND_COLOR_FIELD(
				AdminConfigManager.getConfig().services.i18n.tText(
					'admin/content-block/helpers/image-text-background/image-text-background___achtergrond-kleur'
				),
				isAvo()
					? GET_BACKGROUND_COLOR_OPTIONS_AVO()[1]
					: GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
			),
		},
	},
	block: {
		state: INITIAL_IMAGE_TEXT_BACKGROUND_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
