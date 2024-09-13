import { AdminConfigManager } from '~core/config';
import {
	GET_BACKGROUND_ALIGN_OPTIONS,
	GET_SIMPLE_ALIGN_OPTIONS,
} from '~modules/content-page/const/get-align-options';
import { GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF } from '~modules/content-page/const/get-color-options';
import { GET_HEADING_TYPE_OPTIONS } from '~modules/content-page/const/get-heading-type-options';
import type { FileUploadProps } from '~modules/shared/components/FileUpload/FileUpload';
import { GET_ADMIN_ICON_OPTIONS } from '~modules/shared/consts/icons.consts';
import { tText } from '~shared/helpers/translation-functions';
import type {
	ContentBlockConfig,
	DefaultContentBlockState,
	ImageTextBackgroundBlockComponentState} from '../../../types/content-block.types';
import {
	Color,
	ContentBlockEditor,
	ContentBlockType
} from '../../../types/content-block.types';

import {
	BACKGROUND_COLOR_FIELD,
	BLOCK_FIELD_DEFAULTS,
	BLOCK_STATE_DEFAULTS,
	FOREGROUND_COLOR_FIELD,
	TEXT_FIELD,
} from '../defaults';

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
	name: tText(
		'react-admin/modules/content-page/components/blocks/block-image-text-background/block-image-text-background___admin-content-block-helpers-image-text-background-image-text-background'
	),
	type: ContentBlockType.ImageTextBackground,
	components: {
		state: INITIAL_IMAGE_TEXT_BACKGROUND_COMPONENTS_STATE(),
		fields: {
			heading: TEXT_FIELD(
				tText(
					'admin/content-block/helpers/image-text-background/image-text-background___titel-is-verplicht'
				),
				{
					label: tText(
						'admin/content-block/helpers/image-text-background/image-text-background___titel-tekst'
					),
					editorType: ContentBlockEditor.TextInput,
				}
			),
			headingType: {
				label: tText(
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
				label: tText(
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
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-type'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: AdminConfigManager.getConfig().components.buttonTypes(),
				},
			},
			buttonLabel: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-tekst'
				),
				editorType: ContentBlockEditor.TextInput,
			},
			buttonAltTitle: TEXT_FIELD(undefined, {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___alt-title-text'
				),
				editorType: ContentBlockEditor.TextInput,
				validator: undefined,
			}),
			buttonAction: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-actie'
				),
				editorType: ContentBlockEditor.ContentPicker,
				editorProps: {
					allowedTypes: ['CONTENT_PAGE', 'INTERNAL_LINK', 'EXTERNAL_LINK', 'ANCHOR_LINK'],
				},
			},
			buttonIcon: {
				label: tText(
					'admin/content-block/helpers/image-text-background/image-text-background___knop-icoon'
				),
				editorType: ContentBlockEditor.IconPicker,
				editorProps: {
					options: GET_ADMIN_ICON_OPTIONS(),
				},
			},
			buttonIconAlignment: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/image-text-background/image-text-background___button-icon-alignment'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_SIMPLE_ALIGN_OPTIONS(),
				},
			},
			imageAlignment: {
				label: tText(
					'react-admin/modules/content-page/components/blocks/block-image-text-background/block-image-text-background___afbeelding-uitlijning'
				),
				editorType: ContentBlockEditor.Select,
				editorProps: {
					options: GET_BACKGROUND_ALIGN_OPTIONS(),
				},
			},
			foregroundColor: FOREGROUND_COLOR_FIELD(
				tText(
					'admin/content-block/helpers/image-text-background/image-text-background___voorgrond-kleur'
				)
			),
			backgroundColor: BACKGROUND_COLOR_FIELD(
				tText(
					'admin/content-block/helpers/image-text-background/image-text-background___achtergrond-kleur'
				),
				GET_BACKGROUND_COLOR_OPTIONS_ARCHIEF()[1]
			),
		},
	},
	block: {
		state: INITIAL_IMAGE_TEXT_BACKGROUND_BLOCK_STATE(),
		fields: BLOCK_FIELD_DEFAULTS(),
	},
});
